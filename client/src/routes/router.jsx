import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../components/ui/layout.jsx";
import ProtectedRoute from "../protected/ProtectedRoute.jsx";

import Home from "../modules/user/Home.jsx";
import Companies from "../modules/user/Companies.jsx";
import CareerKit from "../modules/user/CareerKit.jsx";
import Alerts from "../modules/user/alerts.jsx";
import Jobs from "../modules/user/jobs/job-Index.jsx";
import JobDetail from "../modules/user/jobs/job-details.jsx";

import RecruiterCreateJob from "../modules/recruiter/hire-jobs/create-job.jsx";
import TalentHire from "../modules/recruiter/recruter-premier/talent-hire.jsx";
import RecruiterProfileform from "../modules/recruiter/recruiter-dashboard/recruiter-profile-form.jsx";
import JobPosted from "../modules/recruiter/recruiter-dashboard/job-posted.jsx";
import RecruiterDashboard from "../modules/recruiter/recruiter-dashboard/recruiter-index.jsx";
import RecruiterProfile from "../modules/recruiter/recruiter-dashboard/recruiter-profile.jsx";
import JobApplicants from "../modules/recruiter/recruiter-dashboard/JobApplicants.jsx";
import SignIn from "../modules/auth/SignIn.jsx";
import SignUp from "../modules/auth/SignUp.jsx";
import Forgot from "../modules/auth/Forgot.jsx";
import Profile from "../components/profile/profile.jsx";

import Dashboard from "../modules/user/User-Dashboard/user-Index.jsx";
import UserProfile from "../modules/user/User-Dashboard/user-Profile.jsx";
import Saved from "../modules/user/User-Dashboard/user-Saved.jsx";
import Applied from "../modules/user/User-Dashboard/user-Applied.jsx";
import AlertsManage from "../modules/user/User-Dashboard/user-Alerts.jsx";


// Import Admin Components
import AdminLayout from "../modules/admin/AdminLayout.jsx";
import AdminSignIn from "../modules/admin/SignIn.jsx";
import AdminSignUp from "../modules/admin/SignUp.jsx";
import AdminDashboard from "../modules/admin/AdminDashboard.jsx";
import AdminUsers from "../modules/admin/AdminUsers.jsx";
import AdminRecruiters from "../modules/admin/AdminRecruiters.jsx";
import AdminJobs from "../modules/admin/AdminJobs.jsx";
import PendingRecruiters from "../modules/admin/PendingRecruiters.jsx";
import VerifiedRecruiters from "../modules/admin/VerifiedRecruiters.jsx";
import PendingJobs from "../modules/admin/PendingJobs.jsx";
import ApprovedJobs from "../modules/admin/ApprovedJobs.jsx";
import ClosedJobs from "../modules/admin/ClosedJobs.jsx";
import RejectedJobs from "../modules/admin/RejectedJobs.jsx";

// Import Recruiter Layout (CREATE THIS FILE)
import RecruiterLayout from "../modules/recruiter/recruiter-dashboard/RecruiterLayout.jsx";

// Define application routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },

      // Public pages (accessible without login)
      { path: "home", element: <Home /> },
      { path: "companies", element: <Companies /> },
      { path: "career-kit", element: <CareerKit /> },
      { path: "alerts", element: <Alerts /> },
      { path: "jobs", element: <Jobs /> },
      { path: "jobs/:id", element: <JobDetail /> },

      // Auth pages (accessible without login) - No footer on these
      { path: "sign-in", element: <SignIn /> },
      { path: "sign-up", element: <SignUp /> },
      { path: "forgot", element: <Forgot /> },

      // Admin Auth pages (accessible without login)
      { path: "admin/signin", element: <AdminSignIn /> },
      { path: "admin/signup", element: <AdminSignUp /> },

      // Profile - Public
      { path: "profile", element: <Profile /> },

      // ================= USER/JOB SEEKER ONLY ROUTES =================
      {
        path: "dashboard",
        element: (
          <ProtectedRoute roles={["user"]}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/profile",
        element: (
          <ProtectedRoute roles={["user"]}>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/saved",
        element: (
          <ProtectedRoute roles={["user"]}>
            <Saved />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/applied",
        element: (
          <ProtectedRoute roles={["user"]}>
            <Applied />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard/alerts",
        element: (
          <ProtectedRoute roles={["user"]}>
            <AlertsManage />
          </ProtectedRoute>
        ),
      },

      { path: "*", element: <Navigate to="/home" replace /> },
    ],
  },

  // ================= RECRUITER ROUTES WITH SIDEBAR (SEPARATE FROM MAIN LAYOUT) =================
  {
    path: "/",
    element: (
      <ProtectedRoute roles={["recruiter"]}>
        <RecruiterLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "recruiter-dashboard",
        element: <RecruiterDashboard />,
      },
      {
        path: "recruiter-profile",
        element: <RecruiterProfile />,
      },
      {
        path: "recruiter-profileform",
        element: <RecruiterProfileform />,
      },
      {
        path: "create-job",
        element: <RecruiterCreateJob />,
      },
      {
        path: "job-posted",
        element: <JobPosted />,
      },
      {
        path: "talent-hire",
        element: <TalentHire />,
      },
      {
        path: "recruiter/jobs/:jobId/applicants",
        element: <JobApplicants />,
      },
    ],
  },

  // ================= ADMIN ROUTES WITH SIDEBAR (SEPARATE FROM MAIN LAYOUT) =================
  {
    path: "admin",
    element: (
      <ProtectedRoute roles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "users", element: <AdminUsers /> },
      { path: "recruiters", element: <AdminRecruiters /> },
      { path: "jobs", element: <AdminJobs /> },
      { path: "pending-recruiters", element: <PendingRecruiters /> },
      { path: "verified-recruiters", element: <VerifiedRecruiters /> },
      { path: "pending-jobs", element: <PendingJobs /> },
      { path: "approved-jobs", element: <ApprovedJobs /> },
      { path: "closed-jobs", element: <ClosedJobs /> },
      { path: "rejected-jobs", element: <RejectedJobs /> },
    ],
  },
]);

export default router;