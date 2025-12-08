import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "../protected/ProtectedRoute.jsx";

// Import Layouts
import GuestLayout from "../components/layout/guest-layout/GuestLayout.jsx";
import CandidateLayout from "../components/layout/candidate-layout/CandidateLayout.jsx";
import RecruiterLayout from "../components/layout/recruiter-layout/RecruiterLayout.jsx";
import AdminLayout from "../components/layout/admin-layout/AdminLayout.jsx";

// Import Public/Guest Components
import Home from "../modules/guest/Home.jsx";
import Companies from "../modules/guest/Companies.jsx";
import CareerKit from "../modules/guest/CareerKit.jsx";
import Alerts from "../modules/guest/alerts.jsx";
import Jobs from "../modules/guest/jobs/job-Index.jsx";
import JobDetail from "../modules/guest/jobs/job-details.jsx";
import Profile from "../components/profile/profile.jsx";

// Import Auth Components (Candidate/Recruiter - Google Login Only)
import SignIn from "../modules/auth/candidate-recruiter/SignIn.jsx";
import SignUp from "../modules/auth/candidate-recruiter/SignUp.jsx";
import Forgot from "../modules/auth/candidate-recruiter/Forgot.jsx";
import SignInModal from "../modules/auth/candidate-recruiter/SignInModal.jsx";

// Import Candidate Dashboard Components (renamed paths)
import Dashboard from "../modules/candidate/dashboard/home.jsx";
import UserProfile from "../modules/candidate/dashboard/profile.jsx";
import Saved from "../modules/candidate/jobs/saved-list.jsx";
import Applied from "../modules/candidate/jobs/applied-list.jsx";

// Import Recruiter Components
import RecruiterCreateJob from "../modules/recruiter/hire-jobs/create-job.jsx";
import TalentHire from "../modules/recruiter/recruter-premier/talent-hire.jsx";
import RecruiterProfileform from "../modules/recruiter/recruiter-dashboard/recruiter-profile-form.jsx";
import JobPosted from "../modules/recruiter/recruiter-dashboard/job-posted.jsx";
import RecruiterDashboard from "../modules/recruiter/recruiter-dashboard/recruiter-index.jsx";
import RecruiterProfile from "../modules/recruiter/recruiter-dashboard/recruiter-profile.jsx";
import JobApplicants from "../modules/recruiter/recruiter-dashboard/JobApplicants.jsx";

// Import Admin Auth Components (Username/Password Login)
import AdminSignIn from "../modules/auth/admin/SignIn.jsx";
import AdminSignUp from "../modules/auth/admin/SignUp.jsx";
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

// Define application routes
const router = createBrowserRouter([
  // ================= GUEST/PUBLIC ROUTES (Navbar + Footer) =================
  {
    path: "/",
    element: <GuestLayout />,
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
      { path: "sign-in-modal", element: <SignInModal /> },

      // Admin Auth pages (accessible without login)
      { path: "admin/signin", element: <AdminSignIn /> },
      { path: "admin/signup", element: <AdminSignUp /> },

      // Profile - Public
      { path: "profile", element: <Profile /> },

      { path: "*", element: <Navigate to="/home" replace /> },
    ],
  },

  // ================= CANDIDATE/USER ROUTES WITH SIDEBAR =================
  {
    path: "/",
    element: (
      <ProtectedRoute roles={["user"]}>
        <CandidateLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "dashboard/profile",
        element: <UserProfile />,
      },
      {
        path: "dashboard/saved",
        element: <Saved />,
      },
      {
        path: "dashboard/applied",
        element: <Applied />,
      },
    ],
  },

  // ================= RECRUITER ROUTES WITH SIDEBAR =================
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

  // ================= ADMIN ROUTES WITH SIDEBAR =================
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