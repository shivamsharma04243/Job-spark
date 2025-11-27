// src/routes.jsx

// Made all pages accessible without login by removing ProtectedRoute from routes.jsx

// routes now fully public — removed all route protection

import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../components/ui/layout.jsx";

import Home from "../modules/user/Home.jsx";
import Companies from "../modules/user/Companies.jsx";
import CareerKit from "../modules/user/CareerKit.jsx";
import Alerts from "../modules/user/alerts.jsx";
import Jobs from "../modules/user/jobs/job-Index.jsx";
import JobDetail from "../modules/user/jobs/job-details.jsx";

import RecruiterCreateJob from "../modules/recruiter/hire-jobs/create-job.jsx";
import TalentHire from "../modules/recruiter/recruter-premier/talent-hire.jsx";
import RecruiterProfileform  from "../modules/recruiter/recruiter-dashboard/recruiter-profile-form.jsx";
import JobPosted from "../modules/recruiter/recruiter-dashboard/job-posted.jsx";
import RecruiterDashboard from "../modules/recruiter/recruiter-dashboard/recruiter-index.jsx";
import RecruiterProfile  from "../modules/recruiter/recruiter-dashboard/recruiter-profile.jsx";

import SignIn from "../modules/auth/SignIn.jsx";
import SignUp from "../modules/auth/SignUp.jsx";
import Forgot from "../modules/auth/Forgot.jsx";
import Profile from "../components/profile/profile.jsx";

import Dashboard from "../modules/user/User-Dashboard/user-Index.jsx";
import UserProfile from "../modules/user/User-Dashboard/user-Profile.jsx";
import Saved from "../modules/user/User-Dashboard/user-Saved.jsx";
import Applied from "../modules/user/User-Dashboard/user-Applied.jsx";
import AlertsManage from "../modules/user/User-Dashboard/user-Alerts.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },

      // Public pages
      { path: "home", element: <Home /> },
      { path: "companies", element: <Companies /> },
      { path: "career-kit", element: <CareerKit /> },
      { path: "alerts", element: <Alerts /> },
      { path: "jobs", element: <Jobs /> },
      { path: "jobs/:id", element: <JobDetail /> },

      // Auth
      { path: "sign-in", element: <SignIn /> },
      { path: "sign-up", element: <SignUp /> },
      { path: "forgot", element: <Forgot /> },

      // Profile & Dashboards — now PUBLIC
      { path: "profile", element: <Profile /> },

      { path: "RecruiterProfileform", element: <RecruiterProfileform /> },
      { path: "recruiter-profile", element: <RecruiterProfile /> },
      { path: "create-job", element: <RecruiterCreateJob /> },
      { path: "job-posted", element: <JobPosted /> },
      { path: "recruiter-dashboard", element: <RecruiterDashboard /> },

      // Premier Talent Hire
      { path: "talent-hire", element: <TalentHire /> },

      // User Dashboard
      { path: "dashboard", element: <Dashboard /> },
      { path: "dashboard/profile", element: <UserProfile /> },
      { path: "dashboard/saved", element: <Saved /> },
      { path: "dashboard/applied", element: <Applied /> },
      { path: "dashboard/alerts", element: <AlertsManage /> },

      { path: "*", element: <Navigate to="/home" replace /> },
    ],
  },
]);

export default router;
