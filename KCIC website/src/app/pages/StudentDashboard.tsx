import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Alert, AlertDescription } from "../components/ui/alert";
import { PlusCircle, FileText, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { getCurrentUser, getStudentPosts, createPost, type BlogPost } from "../services/api";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [myPosts, setMyPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'student') {
      navigate('/login');
      return;
    }

    loadPosts();
  }, [user, navigate]);

  const loadPosts = async () => {
    try {
      const posts = await getStudentPosts();
      setMyPosts(posts);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);
      await createPost(title, content, tagArray);
      
      setTitle("");
      setContent("");
      setTags("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Reload posts
      await loadPosts();
    } catch (error: any) {
      console.error('Failed to create post:', error);
      alert('Failed to create post: ' + (error.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#1E3A8A] mb-2">Student Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name}!</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* My Blogs Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                My Blog Posts
              </CardTitle>
              <CardDescription>Track the status of your submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-gray-500 text-center py-8">Loading...</p>
              ) : myPosts.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(post.status)}
                              {getStatusBadge(post.status)}
                            </div>
                          </TableCell>
                          <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No blog posts yet. Create your first one!</p>
              )}

              {/* Show feedback for rejected posts */}
              {myPosts.some(p => p.status === 'rejected' && p.feedback) && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-semibold text-sm text-gray-700">Feedback on Rejected Posts:</h4>
                  {myPosts
                    .filter(p => p.status === 'rejected' && p.feedback)
                    .map(post => (
                      <Alert key={post.id}>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <span className="font-medium">{post.title}:</span> {post.feedback}
                        </AlertDescription>
                      </Alert>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Create Blog Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Create New Blog Post
              </CardTitle>
              <CardDescription>Submit your article for department review</CardDescription>
            </CardHeader>
            <CardContent>
              {showSuccess && (
                <Alert className="mb-4 bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Blog post submitted successfully! It's now pending review.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter your blog title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your blog content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="Enter tags separated by commas (e.g., AI, Technology, Research)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">Separate tags with commas</p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Department:</strong> {user.department}
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#1E3A8A] hover:bg-blue-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}