import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../components/apiconfig/apiconfig";

/**
 * GuestOnlyRoute - Only allows access to guests (non-authenticated users)
 * If a user is logged in (admin, recruiter, or candidate), redirects them to their dashboard
 */
export default function GuestOnlyRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get("/auth/session");
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

  // If user is logged in, redirect to their appropriate dashboard
  if (user) {
    const role = user?.role;

    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (role === "recruiter") {
      return <Navigate to="/recruiter-dashboard" replace />;
    } else if (role === "candidate") {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // User is not logged in → Show guest content
  return children;
}










