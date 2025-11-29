import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../components/apiconfig/apiconfig";

export default function ProtectedRoute({ children, roles }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get("/auth/authcheck");
        if (alive) setUser(data?.user || null);
      } catch (e) {
        if (alive) setUser(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!user) {
    // For admin routes, redirect to admin signin
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/signin" replace state={{ from: location }} />;
    }
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  const role = user?.role;
  
  // Check if user has required role
  if (roles && roles.length > 0 && !roles.includes(role)) {
    // If user tries to access wrong role's pages, redirect them to appropriate page
    if (role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (role === "recruiter") {
      return <Navigate to="/recruiter-dashboard" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  // Authenticated + allowed role → Show protected content
  return children;
}