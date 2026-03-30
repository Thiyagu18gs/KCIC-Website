import { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { BookOpen, AlertCircle } from "lucide-react";
import { signIn } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await signIn(email, password);
      
      // Redirect based on role
      if (user.role === 'student') {
        navigate('/student/dashboard');
      } else if (user.role === 'depthead') {
        navigate('/depthead/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      }
      
      // Reload to update header
      window.location.reload();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 to-slate-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-[#1E3A8A] p-3 rounded-full">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-[#1E3A8A]">Welcome Back</CardTitle>
          <CardDescription>Sign in to your KCIC account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@kcic.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#1E3A8A] hover:bg-blue-800"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600 mb-3 font-semibold">Demo Credentials:</p>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="bg-blue-50 p-2 rounded">
                <p className="font-medium text-[#1E3A8A]">Student Account:</p>
                <p>Email: student@kcic.edu</p>
                <p>Password: (any password)</p>
              </div>
              <div className="bg-blue-50 p-2 rounded">
                <p className="font-medium text-[#1E3A8A]">Dept Head Account:</p>
                <p>Email: depthead@kcic.edu</p>
                <p>Password: (any password)</p>
              </div>
              <div className="bg-blue-50 p-2 rounded">
                <p className="font-medium text-[#1E3A8A]">Admin Account:</p>
                <p>Email: admin@kcic.edu</p>
                <p>Password: (any password)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}