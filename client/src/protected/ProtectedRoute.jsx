import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // TODO: replace with your real auth check (context/redux/cookie)
  const token = localStorage.getItem("hs_token");
  const location = useLocation();
  if (!token) return <Navigate to="/sign-in" replace state={{ from: location }} />;
  return children;
}
