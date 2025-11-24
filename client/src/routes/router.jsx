// src/routes.jsx
import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../components/ui/layout.jsx"

// ------------------------------
// User (public) pages
// ------------------------------
import Home from "../modules/user/Home.jsx";
import Companies from "../modules/user/Companies.jsx";
import CareerKit from "../modules/user/CareerKit.jsx";
import Alerts from "../modules/user/alerts.jsx";
import Jobs from "../modules/user/jobs/job-Index.jsx";
import JobDetail from "../modules/user/jobs/job-details.jsx";

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
import Profile from "../components/profile/profile.jsx";

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
 * Router with Layout wrapping all routes.
 * - Root element is <Layout />; all pages render inside its <Outlet />.
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // layout wraps all child routes
    children: [
      // default: redirect to /home
      { index: true, element: <Navigate to="/home" replace /> },

      // Public pages
      { path: "home", element: <Home /> },
      { path: "companies", element: <Companies /> },
      { path: "career-kit", element: <CareerKit /> },
      { path: "alerts", element: <Alerts /> },
      { path: "jobs", element: <Jobs /> },
      { path: "jobs/:id", element: <JobDetail /> },

      // Authentication
      { path: "sign-in", element: <SignIn /> },
      { path: "sign-up", element: <SignUp /> },
      { path: "forgot", element: <Forgot /> },

      // Simple protected profile page (view-only)
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },

      // Recruiter-only routes (role-protected)
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

      // Premier Talent Hire (public for now)
      { path: "talent-hire", element: <TalentHire /> },

      // User Dashboard (protected)
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/profile",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/saved",
        element: (
          <ProtectedRoute>
            <Saved />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/applied",
        element: (
          <ProtectedRoute>
            <Applied />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/alerts",
        element: (
          <ProtectedRoute>
            <AlertsManage />
          </ProtectedRoute>
        ),
      },

      // Catch-all within layout: redirect to sign-in
      { path: "*", element: <Navigate to="/sign-in" replace /> },
    ],
  },
]);

export default router;
