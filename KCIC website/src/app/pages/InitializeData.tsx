import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { CheckCircle, AlertCircle, Database } from "lucide-react";
import { signUp, createAnnouncement } from "../services/api";

export default function InitializeData() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const initialize = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Create demo users
      await signUp("student@kcic.edu", "password123", "John Student", "student", "Computer Science");
      await signUp("depthead@kcic.edu", "password123", "Dr. Mary Head", "depthead", "Computer Science");
      await signUp("admin@kcic.edu", "password123", "Admin User", "admin", "Administration");
      
      // Create announcements (need to login as admin first)
      // For now, these will be created manually via admin dashboard
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Initialization error:', err);
      setError(err.message || "Failed to initialize data. Some accounts may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 to-slate-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-[#1E3A8A] p-3 rounded-full">
              <Database className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-[#1E3A8A]">Initialize Database</CardTitle>
          <CardDescription>Set up demo users and data for KCIC</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Database initialized successfully! Redirecting to login...
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm">
            <p className="font-semibold text-[#1E3A8A]">This will create the following demo accounts:</p>
            <ul className="space-y-1 text-gray-700">
              <li>• <strong>Student:</strong> student@kcic.edu (password: password123)</li>
              <li>• <strong>Dept Head:</strong> depthead@kcic.edu (password: password123)</li>
              <li>• <strong>Admin:</strong> admin@kcic.edu (password: password123)</li>
            </ul>
          </div>

          <Button 
            onClick={initialize}
            className="w-full bg-[#1E3A8A] hover:bg-blue-800"
            disabled={loading || success}
          >
            {loading ? "Initializing..." : success ? "Success!" : "Initialize Database"}
          </Button>

          <div className="text-center">
            <Button 
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-sm text-gray-600"
            >
              Skip and go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
