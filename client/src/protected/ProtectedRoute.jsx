import { Navigate, useLocation } from "react-router-dom";

<<<<<<< HEAD
/**
 * ProtectedRoute Component
 * -------------------------
 * Purpose:
 *   - Protect pages that require authentication.
 *   - Optionally restrict pages to specific roles (e.g., "recruiter").
 *
 * Props:
 *   - children → The page/component to render if authenticated.
 *   - roles → (optional) Array of allowed roles. Example: ["recruiter"].
 *
 * Flow:
 *   1. Check user session by calling GET /auth/authcheck.
 *   2. If not logged in → redirect to login page.
 *   3. If logged in but role is not allowed → redirect to correct dashboard.
 *   4. If logged in + valid role → render protected content.
 */
export default function ProtectedRoute({ children, roles }) {
  const [loading, setLoading] = useState(true); // Wait until auth check finishes
  const [user, setUser] = useState(null);       // Store user info
  const location = useLocation();               // Track where user came from

  useEffect(() => {
    /**
     * alive → Helps prevent state updates when component unmounts.
     * Avoids React warnings like: "Can't perform a React state update on an unmounted component".
     */
    let alive = true;

    (async () => {
      try {
        // Validate session via backend (cookie-based auth)
        const { data } = await api.get("/auth/authcheck");

        // If component is still mounted, update user state
        if (alive) setUser(data?.user || null);
      } catch (e) {
        // On any error (401, network failure), treat as unauthenticated
        if (alive) setUser(null);
      } finally {
        // Once request completes, end loading state
        if (alive) setLoading(false);
      }
    })();

    // Cleanup to avoid memory leaks
    return () => {
      alive = false;
    };
  }, []);

  // While checking authentication → render nothing or loader
  if (loading) return null; 
  // Optionally: return <Loader />;

  // Not logged in → redirect to sign-in page
  if (!user) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  /**
   * Role-based Access Check
   * ------------------------
   * If a route requires specific roles, only allow them.
   * Example:
   * <ProtectedRoute roles={["recruiter"]}>...</ProtectedRoute>
   */
  const role = user?.role;
  if (roles && roles.length > 0 && !roles.includes(role)) {
    // If user has wrong role → send them to their own dashboard
    const fallback =
      role === "recruiter" ? "/recruiter-dashboard" : "/dashboard";

    return <Navigate to={fallback} replace />;
  }

  // Authenticated + allowed role → Show protected content
=======
export default function ProtectedRoute({ children }) {
  // TODO: replace with your real auth check (context/redux/cookie)
  const token = localStorage.getItem("hs_token");
  const location = useLocation();
  if (!token) return <Navigate to="/sign-in" replace state={{ from: location }} />;
>>>>>>> SURAJ
  return children;
}
