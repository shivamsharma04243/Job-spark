import { createBrowserRouter } from "react-router-dom";

// ------------------------------
// User (public) pages
// ------------------------------
import Home from "../modules/user/Home.jsx";
import Companies from "../modules/user/Companies.jsx";
import CareerKit from "../modules/user/CareerKit.jsx";
import Alerts from "../modules/user/alerts.jsx";
import Jobs from "../modules/user/jobs/job-Index.jsx";
import JobDetail from "../modules/user/jobs/job-details.jsx";
import Footer from "../components/ui/footer.jsx";

// ------------------------------
// Recruiter pages (protected)
// ------------------------------
import RecruiterCreateJob from "../modules/recruiter/hire-jobs/create-job.jsx";
import TalentHire from "../modules/recruiter/recruter-premier/talent-hire.jsx";
import RecruiterProfile from "../modules/recruiter/recruiter-dashboard/recruiter-profile.jsx";
import JobPosted from "../modules/recruiter/recruiter-dashboard/job-posted.jsx";
import RecruiterDashboard from "../modules/recruiter/recruiter-dashboard/recruiter-index.jsx";

// ------------------------------
// Authentication pages
// ------------------------------
import SignIn from "../modules/auth/SignIn.jsx";
import SignUp from "../modules/auth/SignUp.jsx";
import Forgot from "../modules/auth/Forgot.jsx";

// ------------------------------
// User dashboard (protected)
// ------------------------------
import Dashboard from "../modules/user/User-Dashboard/user-Index.jsx";
import UserProfile from "../modules/user/User-Dashboard/user-Profile.jsx";
import Saved from "../modules/user/User-Dashboard/user-Saved.jsx";
import Applied from "../modules/user/User-Dashboard/user-Applied.jsx";
import AlertsManage from "../modules/user/User-Dashboard/user-Alerts.jsx";

import ProtectedRoute from "../protected/ProtectedRoute.jsx";

/**
 * Application Router
 * -------------------
 * - Uses React Router v6 `createBrowserRouter`.
 * - Public routes: accessible by anyone (home, jobs, company pages, etc.).
 * - Protected routes: require login (user dashboard, recruiter dashboard).
 * - Role-based routes: recruiter-only pages protected using <ProtectedRoute roles={["recruiter"]} />.
 * - Catch-all route: redirect unknown URLs to /sign-in.
 */
const router = createBrowserRouter([
<<<<<<< HEAD

  /**
   * Default route
   * -------------
   * Accessing "/" redirects user to "/home".
   */
  { path: "/", element: <Navigate to="/home" replace /> },

  /**
   * Public User-Facing Pages
   * -------------------------
   * These pages are accessible without login.
   */
  { path: "/home", element: <Home /> },
=======
  { path: "/", element: <Home /> },
>>>>>>> SURAJ
  { path: "/companies", element: <Companies /> },
  { path: "/career-kit", element: <CareerKit /> },
  { path: "/alerts", element: <Alerts /> },
  { path: "/jobs", element: <Jobs /> },
  { path: "/jobs/:id", element: <JobDetail /> },
  { path: "/footer", element: <Footer /> },

  /**
   * Authentication Pages
   * ---------------------
   * Public because user signs in here.
   */
  { path: "/sign-in", element: <SignIn /> },
  { path: "/sign-up", element: <SignUp /> },
  { path: "/forgot", element: <Forgot /> },
<<<<<<< HEAD

  /**
   * Recruiter-Only Routes (Protected + Role Restricted)
   * ----------------------------------------------------
   * Only accessible to users with `role = "recruiter"`.
   * If a normal user tries to access these, they get redirected
   * to their own dashboard.
   */
  {
    path: "recruiter-profile",
    element: (
      <ProtectedRoute roles={["recruiter"]}>
        <RecruiterProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "create-job",
    element: (
      <ProtectedRoute roles={["recruiter"]}>
        <RecruiterCreateJob />
      </ProtectedRoute>
    ),
  },
  {
    path: "job-posted",
    element: (
      <ProtectedRoute roles={["recruiter"]}>
        <JobPosted />
      </ProtectedRoute>
    ),
  },
  {
    path: "recruiter-dashboard",
    element: (
      <ProtectedRoute roles={["recruiter"]}>
        <RecruiterDashboard />
      </ProtectedRoute>
    ),
  },

  /**
   * Premier Talent Hire
   * --------------------
   * Currently public — accessible without authentication.
   * (Can be protected later.)
   */
  { path: "/talent-hire", element: <TalentHire /> },

  /**
   * User Dashboard Routes (Protected)
   * ----------------------------------
   * These pages require login but do not require a recruiter role.
   */
  {
=======
// recruiter
  {path: "recruiter-profile", element: <RecruiterProfile />},
  {path: "create-job", element: <RecruiterCreateJob />},
  {path: "job-posted", element: <JobPosted />},
  {path: "recruiter-dashboard", element: <RecruiterDashboard />},
  // premier talent hire
  {path: "/talent-hire", element: <TalentHire />},
  // user dashboard
  {path: "/dashboard/profile", element: <UserProfile />},
  {path: "/dashboard/saved", element: <Saved />},
  {path: "/dashboard/applied", element: <Applied />},
  {path: "/dashboard/alerts", element: <AlertsManage />},
 
{
>>>>>>> SURAJ
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/profile",
    element: (
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/saved",
    element: (
      <ProtectedRoute>
        <Saved />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/applied",
    element: (
      <ProtectedRoute>
        <Applied />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/alerts",
    element: (
      <ProtectedRoute>
        <AlertsManage />
      </ProtectedRoute>
    ),
  },
<<<<<<< HEAD

  /**
   * Catch-all Route
   * ----------------
   * For any unknown path, redirect to login page.
   */
  { path: "*", element: <Navigate to="/sign-in" replace /> },
=======
  
 
>>>>>>> SURAJ
]);

export default router;
