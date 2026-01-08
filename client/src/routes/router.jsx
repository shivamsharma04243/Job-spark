import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "../protected/ProtectedRoute.jsx";
import ProtectedRecruiterRoute from "../protected/ProtectedRecruiterRoute.jsx";
import GuestOnlyRoute from "../protected/GuestOnlyRoute.jsx";

// Import Layouts
import GuestLayout from "../components/layout/guest-layout/GuestLayout.jsx";
import CandidateLayout from "../components/layout/candidate-layout/CandidateLayout.jsx";
import RecruiterLayout from "../components/layout/recruiter-layout/RecruiterLayout.jsx";
import AdminLayout from "../components/layout/admin-layout/AdminLayout.jsx";

// Import Public/Guest Components (renamed)
import Home from "../modules/guest/Home.jsx";
import Companies from "../modules/guest/companies/companies.jsx";
import CareerGuide from "../modules/guest/guide/career-guide.jsx";
import Jobs from "../modules/guest/jobs/job-list.jsx";
import JobDetail from "../modules/guest/jobs/job-list-details.jsx";
import Profile from "../components/profile/profile.jsx";
import TermsAndConditions from "../modules/guest/legal/TermsAndConditions.jsx";
import PrivacyPolicy from "../modules/guest/legal/PrivacyPolicy.jsx";
import RefundCancellation from "../modules/guest/legal/RefundCancellation.jsx";

// Import Auth Components (Candidate/Recruiter - Google Login Only)
import SignIn from "../modules/auth/candidate-recruiter/SignIn.jsx";
import SignUp from "../modules/auth/candidate-recruiter/SignUp.jsx";
import Forgot from "../modules/auth/candidate-recruiter/Forgot.jsx";
import SignInModal from "../modules/auth/candidate-recruiter/SignInModal.jsx";

// Import Candidate Dashboard Components (renamed paths)
import UserProfile from "../modules/candidate/dashboard/profile.jsx";
import Saved from "../modules/candidate/jobs/saved-list.jsx";
import Applied from "../modules/candidate/jobs/applied-list.jsx";

// Import Recruiter Components
import RecruiterDashboard from "../modules/recruiter/home/home.jsx";
import RecruiterPostJob from "../modules/recruiter/jobs/job-post.jsx";
import JobPosted from "../modules/recruiter/jobs/job-posted.jsx";
import JobApplicants from "../modules/recruiter/jobs/Job-response-list.jsx";
import RecruiterProfile from "../modules/recruiter/profile/recruiter-profile.jsx";
import RecruiterProfileForm from "../modules/recruiter/profile/recruiter-profile-form.jsx";

// Import Admin Auth Components (Username/Password Login)
import AdminSignIn from "../modules/auth/admin/SignIn.jsx";
import AdminSignUp from "../modules/auth/admin/SignUp.jsx";
import AdminDashboard from "../modules/admin/dashboard/dashboard.jsx";
import AdminUsers from "../modules/admin/candidate/candidate-list.jsx";
import AdminRecruiters from "../modules/admin/recruiter/recruiters-list.jsx";
import AdminJobs from "../modules/admin/jobs/jobs-list.jsx";
import PendingRecruiters from "../modules/admin/recruiter/pending-recruiters.jsx";
import VerifiedRecruiters from "../modules/admin/recruiter/verified-recruiters.jsx";
import PendingJobs from "../modules/admin/approval-management/pending-jobs-list.jsx";
import ApprovedJobs from "../modules/admin/approval-management/approval-job-list.jsx";
import ClosedJobs from "../modules/admin/approval-management/closed-jobs-list.jsx";
import RejectedJobs from "../modules/admin/approval-management/rejected-jobs.jsx";
import AdminJobRoles from "../modules/admin/job-role/job-roles-list.jsx";

// Define application routes
const router = createBrowserRouter([
  // ================= GUEST/PUBLIC ROUTES (Navbar + Footer) =================
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },

      // Public pages (accessible without login)
      {
        path: "home",
        element: (
          <GuestOnlyRoute>
            <Home />
          </GuestOnlyRoute>
        )
      },
      { path: "companies", element: <Companies /> },
      { path: "career-guide", element: <CareerGuide /> },
      { path: "jobs", element: <Jobs /> },
      { path: "jobs/:id", element: <JobDetail /> },
      { path: "terms", element: <TermsAndConditions /> },
      { path: "privacy", element: <PrivacyPolicy /> },
      { path: "refund", element: <RefundCancellation /> },

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
      <ProtectedRoute roles={["candidate"]}>
        <CandidateLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Jobs />,
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
        path: "recruiter-profile-form",
        element: <RecruiterProfileForm />,
      },
      {
        path: "create-job",
        element: (
          <ProtectedRecruiterRoute>
            <RecruiterPostJob />
          </ProtectedRecruiterRoute>
        ),
      },
      {
        path: "job-posted",
        element: (
          <ProtectedRecruiterRoute>
            <JobPosted />
          </ProtectedRecruiterRoute>
        ),
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
      { path: "job-roles", element: <AdminJobRoles /> },
    ],
  },
]);

export default router;