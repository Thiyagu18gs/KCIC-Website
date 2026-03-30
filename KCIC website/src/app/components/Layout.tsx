import { Link, Outlet, useLocation } from "react-router";
import { BookOpen, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { getCurrentUser, logout } from "../services/api";
import { useState, useEffect } from "react";

export default function Layout() {
  const location = useLocation();
  const [user, setUser] = useState(getCurrentUser());

  // Re-check user on location change (in case of login/logout)
  useEffect(() => {
    setUser(getCurrentUser());
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setUser(null);
    window.location.href = '/';
  };

  const getDashboardLink = () => {
    if (!user) return null;
    switch (user.role) {
      case 'student':
        return '/student/dashboard';
      case 'depthead':
        return '/depthead/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return null;
    }
  };

  const dashboardLink = getDashboardLink();
  const isDashboardActive = dashboardLink && location.pathname === dashboardLink;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-[#1E3A8A] text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <BookOpen className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold">Kings Cornerstone International College</h1>
                <p className="text-xs text-blue-200">Academic Excellence & Innovation</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link 
                to="/" 
                className={`hover:text-blue-200 transition-colors ${location.pathname === '/' ? 'font-semibold' : ''}`}
              >
                Home
              </Link>
              <Link 
                to="/blogs" 
                className={`hover:text-blue-200 transition-colors ${location.pathname === '/blogs' ? 'font-semibold' : ''}`}
              >
                Blogs
              </Link>
              <Link 
                to="/about" 
                className={`hover:text-blue-200 transition-colors ${location.pathname === '/about' ? 'font-semibold' : ''}`}
              >
                About
              </Link>
              {user && dashboardLink && (
                <Link 
                  to={dashboardLink} 
                  className={`hover:text-blue-200 transition-colors ${isDashboardActive ? 'font-semibold' : ''}`}
                >
                  Dashboard
                </Link>
              )}
              {user ? (
                <Button 
                  onClick={handleLogout}
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:text-blue-200 hover:bg-blue-900"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-white hover:text-blue-200 hover:bg-blue-900"
                  >
                    Login
                  </Button>
                </Link>
              )}
            </nav>

            {/* Mobile menu */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white"
              >
                Menu
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#1E3A8A] text-white mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-3">About KCIC</h3>
              <p className="text-sm text-blue-200">
                Kings Cornerstone International College is committed to academic excellence, 
                innovation, and preparing students for global leadership.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Quick Links</h3>
              <ul className="text-sm space-y-2 text-blue-200">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/blogs" className="hover:text-white">Academic Blogs</Link></li>
                <li><Link to="/about" className="hover:text-white">About KCIC</Link></li>
                <li><Link to="/login" className="hover:text-white">Student Portal</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Contact</h3>
              <p className="text-sm text-blue-200">
                Email: info@kcic.edu<br />
                Phone: +1 (555) 123-4567<br />
                Address: 123 Academic Way
              </p>
            </div>
          </div>
          <div className="border-t border-blue-700 mt-8 pt-6 text-center text-sm text-blue-200">
            <p>&copy; 2026 Kings Cornerstone International College. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}