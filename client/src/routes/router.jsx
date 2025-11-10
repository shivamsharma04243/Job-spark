import { createBrowserRouter } from "react-router-dom";

// user pages
import Home from "../modules/user/Home.jsx";
import Companies from "../modules/user/Companies.jsx";
import CareerKit from "../modules/user/CareerKit.jsx";
import Alerts from "../modules/user/alerts.jsx";
import Jobs from "../modules/user/Jobs/Index.jsx";
import JobDetail from "../modules/user/jobs/details.jsx";
// recruiter pages 
import RecruiterCreateJob  from "../modules/recruiter/jobs/create-job.jsx";
import RecruiterProfile from "../modules/recruiter/dashboard/recruiter-profile.jsx";

// auth
import SignIn from "../modules/auth/SignIn.jsx";
import SignUp from "../modules/auth/SignUp.jsx";
import Forgot from "../modules/auth/Forgot.jsx";

// dashboard (protected)
import Dashboard from "../modules/user/Dashboard/Index.jsx";
import UserProfile from "../modules/user/Dashboard/Profile.jsx";
import Saved from "../modules/user/Dashboard/Saved.jsx";
import Applied from "../modules/user/Dashboard/Applied.jsx";
import AlertsManage from "../modules/user/Dashboard/Alerts.jsx";

import ProtectedRoute from "../protected/ProtectedRoute.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/companies", element: <Companies /> },
  { path: "/career-kit", element: <CareerKit /> },
  { path: "/alerts", element: <Alerts /> },
  { path: "/jobs", element: <Jobs /> },
  { path: "/jobs/:id", element: <JobDetail /> },

  { path: "/sign-in", element: <SignIn /> },
  { path: "/sign-up", element: <SignUp /> },
  { path: "/forgot", element: <Forgot /> },
  {path: "/recruiter-profile", element: <RecruiterProfile />},
  {path: "/create-job", element: <RecruiterCreateJob />},
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
]);

export default router;
