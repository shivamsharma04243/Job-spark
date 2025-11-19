import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import api from "../components/apiconfig/apiconfig.jsx";

export default function ProtectedRoute({ children, roles }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get("/auth/me");
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

  if (loading) return null;
  if (!user) return <Navigate to="/sign-in" replace state={{ from: location }} />;

  const role = user?.role;
  if (roles && roles.length > 0 && !roles.includes(role)) {
    const fallback = role === "recruiter" ? "/recruiter-dashboard" : "/dashboard";
    return <Navigate to={fallback} replace />;
  }

  return children;
}
