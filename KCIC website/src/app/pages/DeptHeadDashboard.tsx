import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { CheckCircle, XCircle, Eye, ClipboardList } from "lucide-react";
import { getCurrentUser, getPendingPosts, type BlogPost } from "../data/mockData";

export default function DeptHeadDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [pendingPosts, setPendingPosts] = useState(getPendingPosts(user?.department || 'Computer Science'));
  
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!user || user.role !== 'depthead') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleReview = (post: BlogPost, action: 'approve' | 'reject') => {
    setSelectedPost(post);
    setReviewAction(action);
    setFeedback("");
    setShowReviewDialog(true);
  };

  const handleSubmitReview = () => {
    if (!selectedPost || !reviewAction) return;

    // In a real app, this would send to backend
    setPendingPosts(pendingPosts.filter(p => p.id !== selectedPost.id));
    
    const actionText = reviewAction === 'approve' ? 'approved' : 'rejected';
    setSuccessMessage(`Post "${selectedPost.title}" has been ${actionText}.`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    
    setShowReviewDialog(false);
    setSelectedPost(null);
    setReviewAction(null);
    setFeedback("");
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#1E3A8A] mb-2">Department Head Dashboard</h1>
        <p className="text-gray-600">Welcome, {user.name} - {user.department}</p>
      </div>

      {showSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5" />
            Pending Posts for Review
          </CardTitle>
          <CardDescription>
            Review and approve blog posts from {user.department} students
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingPosts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Date Submitted</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium max-w-xs">
                        {post.title}
                      </TableCell>
                      <TableCell>{post.author}</TableCell>
                      <TableCell>{new Date(post.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{post.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPost(post);
                              setShowReviewDialog(true);
                              setReviewAction(null);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleReview(post, 'approve')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReview(post, 'reject')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No pending posts to review</p>
              <p className="text-gray-400 text-sm">All submissions have been processed</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#1E3A8A]">
              {reviewAction ? `${reviewAction === 'approve' ? 'Approve' : 'Reject'} Post` : 'Review Post'}
            </DialogTitle>
            <DialogDescription>
              {selectedPost?.title}
            </DialogDescription>
          </DialogHeader>

          {selectedPost && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-1">Author</h4>
                <p className="text-gray-600">{selectedPost.author}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-1">Department</h4>
                <p className="text-gray-600">{selectedPost.department}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-1">Date Submitted</h4>
                <p className="text-gray-600">{new Date(selectedPost.date).toLocaleDateString()}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-1">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPost.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Content</h4>
                <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedPost.content}</p>
                </div>
              </div>

              {reviewAction && (
                <div className="space-y-2">
                  <Label htmlFor="feedback">
                    Feedback {reviewAction === 'reject' ? '(Required)' : '(Optional)'}
                  </Label>
                  <Textarea
                    id="feedback"
                    placeholder={`Provide feedback to the student...`}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    required={reviewAction === 'reject'}
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {!reviewAction ? (
              <>
                <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                  Close
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setReviewAction('approve')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setReviewAction('reject')}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => {
                  setReviewAction(null);
                  setFeedback("");
                }}>
                  Cancel
                </Button>
                <Button
                  className={reviewAction === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
                  variant={reviewAction === 'reject' ? 'destructive' : 'default'}
                  onClick={handleSubmitReview}
                  disabled={reviewAction === 'reject' && !feedback.trim()}
                >
                  Confirm {reviewAction === 'approve' ? 'Approval' : 'Rejection'}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
