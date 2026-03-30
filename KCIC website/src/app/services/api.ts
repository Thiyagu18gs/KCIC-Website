import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-493cba78`;

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'depthead' | 'admin';
  department: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  department: string;
  date: string;
  tags: string[];
  status: 'approved' | 'pending' | 'rejected';
  feedback?: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
}

// Auth state management
let currentUser: User | null = null;
let accessToken: string | null = null;

// Initialize from localStorage
const initAuth = () => {
  const storedUser = localStorage.getItem('kcic_user');
  const storedToken = localStorage.getItem('kcic_token');
  
  if (storedUser && storedToken) {
    try {
      currentUser = JSON.parse(storedUser);
      accessToken = storedToken;
    } catch (e) {
      localStorage.removeItem('kcic_user');
      localStorage.removeItem('kcic_token');
    }
  }
};

initAuth();

// Helper function to make authenticated requests
const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// ============= AUTH API =============

export const signUp = async (email: string, password: string, name: string, role: string, department: string): Promise<User> => {
  const data = await makeRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name, role, department }),
  });

  return data.user;
};

export const signIn = async (email: string, password: string): Promise<User> => {
  const data = await makeRequest('/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  currentUser = data.user;
  accessToken = data.access_token;
  
  localStorage.setItem('kcic_user', JSON.stringify(data.user));
  localStorage.setItem('kcic_token', data.access_token);

  return data.user;
};

export const logout = () => {
  currentUser = null;
  accessToken = null;
  localStorage.removeItem('kcic_user');
  localStorage.removeItem('kcic_token');
};

export const getCurrentUser = (): User | null => {
  return currentUser;
};

export const verifyAuth = async (): Promise<User | null> => {
  if (!accessToken) return null;

  try {
    const data = await makeRequest('/auth/user');
    currentUser = data.user;
    localStorage.setItem('kcic_user', JSON.stringify(data.user));
    return data.user;
  } catch (error) {
    console.error('Auth verification failed:', error);
    logout();
    return null;
  }
};

// ============= BLOG POST API =============

export const createPost = async (title: string, content: string, tags: string[]): Promise<BlogPost> => {
  const data = await makeRequest('/posts', {
    method: 'POST',
    body: JSON.stringify({ title, content, tags }),
  });

  return data.post;
};

export const getApprovedPosts = async (): Promise<BlogPost[]> => {
  const data = await makeRequest('/posts/approved');
  return data.posts;
};

export const getPendingPosts = async (department: string): Promise<BlogPost[]> => {
  const data = await makeRequest(`/posts/pending/${encodeURIComponent(department)}`);
  return data.posts;
};

export const getStudentPosts = async (): Promise<BlogPost[]> => {
  const data = await makeRequest('/posts/student');
  return data.posts;
};

export const updatePostStatus = async (postId: string, status: 'approved' | 'rejected', feedback?: string): Promise<BlogPost> => {
  const data = await makeRequest(`/posts/${postId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, feedback }),
  });

  return data.post;
};

// ============= USER MANAGEMENT API =============

export const getAllUsers = async (): Promise<User[]> => {
  const data = await makeRequest('/users');
  return data.users;
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  const data = await makeRequest(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });

  return data.user;
};

export const deleteUser = async (userId: string): Promise<void> => {
  await makeRequest(`/users/${userId}`, {
    method: 'DELETE',
  });
};

// ============= ANNOUNCEMENTS API =============

export const getAnnouncements = async (): Promise<Announcement[]> => {
  const data = await makeRequest('/announcements');
  return data.announcements;
};

export const createAnnouncement = async (title: string, content: string): Promise<Announcement> => {
  const data = await makeRequest('/announcements', {
    method: 'POST',
    body: JSON.stringify({ title, content }),
  });

  return data.announcement;
};

// Export types
export type { User, BlogPost, Announcement };
