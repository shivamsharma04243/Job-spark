import { createBrowserRouter, Navigate } from "react-router-dom";

// user pages
import Home from "../modules/user/Home.jsx";
import Companies from "../modules/user/Companies.jsx";
import CareerKit from "../modules/user/CareerKit.jsx";
import Alerts from "../modules/user/alerts.jsx";
import Jobs from "../modules/user/jobs/job-Index.jsx";
import JobDetail from "../modules/user/jobs/job-details.jsx";
import Footer from "../components/ui/footer.jsx";
// recruiter pages 
import RecruiterCreateJob  from "../modules/recruiter/hire-jobs/create-job.jsx";
import TalentHire from "../modules/recruiter/recruter-premier/talent-hire.jsx";
import RecruiterProfile from "../modules/recruiter/recruiter-dashboard/recruiter-profile.jsx";
import JobPosted from "../modules/recruiter/recruiter-dashboard/job-posted.jsx";
import RecruiterDashboard from "../modules/recruiter/recruiter-dashboard/recruiter-index.jsx";
// auth
import SignIn from "../modules/auth/SignIn.jsx";
import SignUp from "../modules/auth/SignUp.jsx";
import Forgot from "../modules/auth/Forgot.jsx";

//  users dashboard (protected)
import Dashboard from "../modules/user/User-Dashboard/user-Index.jsx";
import UserProfile from "../modules/user/User-Dashboard/user-Profile.jsx";
import Saved from "../modules/user/User-Dashboard/user-Saved.jsx";
import Applied from "../modules/user/User-Dashboard/user-Applied.jsx";
import AlertsManage from "../modules/user/User-Dashboard/user-Alerts.jsx";
import ProtectedRoute from "../protected/ProtectedRoute.jsx";


const router = createBrowserRouter([
  // default: go to sign-in first
  { path: "/", element: <Navigate to="/home" replace /> },

  // public pages (optional: accessible after sign-in via direct URL)
  { path: "/home", element: <Home /> },
  { path: "/companies", element: <Companies /> },
  { path: "/career-kit", element: <CareerKit /> },
  { path: "/alerts", element: <Alerts /> },
  { path: "/jobs", element: <Jobs /> },
  { path: "/jobs/:id", element: <JobDetail /> },
  { path: "/footer", element: <Footer /> },

  // auth
  { path: "/sign-in", element: <SignIn /> },
  { path: "/sign-up", element: <SignUp /> },
  { path: "/forgot", element: <Forgot /> },

  // recruiter (protected + role)
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

  // premier talent hire (public for now)
  { path: "/talent-hire", element: <TalentHire /> },

  // user dashboard (protected)
  {
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

  // catch-all -> sign-in
  { path: "*", element: <Navigate to="/sign-in" replace /> },
]);

export default router;
