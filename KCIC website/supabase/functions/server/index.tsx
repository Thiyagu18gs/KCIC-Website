import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-493cba78/health", (c) => {
  return c.json({ status: "ok" });
});

// ============= AUTH ROUTES =============

// Sign up new user
app.post("/make-server-493cba78/auth/signup", async (c) => {
  try {
    const { email, password, name, role, department } = await c.req.json();

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role, department },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (authError) {
      console.log(`Sign up error: ${authError.message}`);
      return c.json({ error: authError.message }, 400);
    }

    // Store user data in KV store
    await kv.set(`user:${authData.user.id}`, {
      id: authData.user.id,
      email,
      name,
      role,
      department
    });

    return c.json({ 
      user: {
        id: authData.user.id,
        email,
        name,
        role,
        department
      }
    });
  } catch (error) {
    console.log(`Sign up error: ${error}`);
    return c.json({ error: "Failed to create user" }, 500);
  }
});

// Sign in
app.post("/make-server-493cba78/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`Sign in error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Get user data from KV store
    const userData = await kv.get(`user:${data.user.id}`);

    return c.json({
      access_token: data.session.access_token,
      user: userData || {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
        role: data.user.user_metadata?.role,
        department: data.user.user_metadata?.department
      }
    });
  } catch (error) {
    console.log(`Sign in error: ${error}`);
    return c.json({ error: "Failed to sign in" }, 500);
  }
});

// Get current user
app.get("/make-server-493cba78/auth/user", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get user data from KV store
    const userData = await kv.get(`user:${user.id}`);

    return c.json({
      user: userData || {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
        role: user.user_metadata?.role,
        department: user.user_metadata?.department
      }
    });
  } catch (error) {
    console.log(`Get user error: ${error}`);
    return c.json({ error: "Failed to get user" }, 500);
  }
});

// ============= BLOG POST ROUTES =============

// Create blog post
app.post("/make-server-493cba78/posts", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    const { title, content, tags } = await c.req.json();

    const post = {
      id: crypto.randomUUID(),
      title,
      content,
      tags: tags || [],
      authorId: user.id,
      author: userData?.name || 'Unknown',
      department: userData?.department || 'Unknown',
      status: 'pending',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    await kv.set(`post:${post.id}`, post);

    return c.json({ post });
  } catch (error) {
    console.log(`Create post error: ${error}`);
    return c.json({ error: "Failed to create post" }, 500);
  }
});

// Get all approved posts
app.get("/make-server-493cba78/posts/approved", async (c) => {
  try {
    const posts = await kv.getByPrefix('post:');
    const approvedPosts = posts
      .filter((post: any) => post.status === 'approved')
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return c.json({ posts: approvedPosts });
  } catch (error) {
    console.log(`Get approved posts error: ${error}`);
    return c.json({ error: "Failed to get posts" }, 500);
  }
});

// Get pending posts for department head
app.get("/make-server-493cba78/posts/pending/:department", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const department = c.req.param('department');
    const posts = await kv.getByPrefix('post:');
    const pendingPosts = posts
      .filter((post: any) => post.status === 'pending' && post.department === department)
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return c.json({ posts: pendingPosts });
  } catch (error) {
    console.log(`Get pending posts error: ${error}`);
    return c.json({ error: "Failed to get posts" }, 500);
  }
});

// Get student's posts
app.get("/make-server-493cba78/posts/student", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const posts = await kv.getByPrefix('post:');
    const studentPosts = posts
      .filter((post: any) => post.authorId === user.id)
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return c.json({ posts: studentPosts });
  } catch (error) {
    console.log(`Get student posts error: ${error}`);
    return c.json({ error: "Failed to get posts" }, 500);
  }
});

// Update post status (approve/reject)
app.put("/make-server-493cba78/posts/:id/status", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const postId = c.req.param('id');
    const { status, feedback } = await c.req.json();

    const post = await kv.get(`post:${postId}`);
    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }

    const updatedPost = {
      ...post,
      status,
      feedback: feedback || undefined,
      reviewedAt: new Date().toISOString(),
      reviewedBy: user.id
    };

    await kv.set(`post:${postId}`, updatedPost);

    return c.json({ post: updatedPost });
  } catch (error) {
    console.log(`Update post status error: ${error}`);
    return c.json({ error: "Failed to update post status" }, 500);
  }
});

// ============= USER MANAGEMENT ROUTES (ADMIN) =============

// Get all users
app.get("/make-server-493cba78/users", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (userData?.role !== 'admin') {
      return c.json({ error: "Forbidden" }, 403);
    }

    const users = await kv.getByPrefix('user:');
    return c.json({ users });
  } catch (error) {
    console.log(`Get users error: ${error}`);
    return c.json({ error: "Failed to get users" }, 500);
  }
});

// Update user
app.put("/make-server-493cba78/users/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (userData?.role !== 'admin') {
      return c.json({ error: "Forbidden" }, 403);
    }

    const userId = c.req.param('id');
    const { name, email, role, department } = await c.req.json();

    const existingUser = await kv.get(`user:${userId}`);
    if (!existingUser) {
      return c.json({ error: "User not found" }, 404);
    }

    const updatedUser = {
      ...existingUser,
      name,
      email,
      role,
      department
    };

    await kv.set(`user:${userId}`, updatedUser);

    // Also update in Supabase Auth metadata
    await supabase.auth.admin.updateUserById(userId, {
      email,
      user_metadata: { name, role, department }
    });

    return c.json({ user: updatedUser });
  } catch (error) {
    console.log(`Update user error: ${error}`);
    return c.json({ error: "Failed to update user" }, 500);
  }
});

// Delete user
app.delete("/make-server-493cba78/users/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (userData?.role !== 'admin') {
      return c.json({ error: "Forbidden" }, 403);
    }

    const userId = c.req.param('id');

    // Delete from KV store
    await kv.del(`user:${userId}`);

    // Delete from Supabase Auth
    await supabase.auth.admin.deleteUser(userId);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Delete user error: ${error}`);
    return c.json({ error: "Failed to delete user" }, 500);
  }
});

// ============= ANNOUNCEMENT ROUTES =============

// Get announcements
app.get("/make-server-493cba78/announcements", async (c) => {
  try {
    const announcements = await kv.getByPrefix('announcement:');
    const sortedAnnouncements = announcements
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return c.json({ announcements: sortedAnnouncements });
  } catch (error) {
    console.log(`Get announcements error: ${error}`);
    return c.json({ error: "Failed to get announcements" }, 500);
  }
});

// Create announcement (admin only)
app.post("/make-server-493cba78/announcements", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userData = await kv.get(`user:${user.id}`);
    if (userData?.role !== 'admin') {
      return c.json({ error: "Forbidden" }, 403);
    }

    const { title, content } = await c.req.json();

    const announcement = {
      id: crypto.randomUUID(),
      title,
      content,
      date: new Date().toISOString(),
    };

    await kv.set(`announcement:${announcement.id}`, announcement);

    return c.json({ announcement });
  } catch (error) {
    console.log(`Create announcement error: ${error}`);
    return c.json({ error: "Failed to create announcement" }, 500);
  }
});

Deno.serve(app.fetch);
