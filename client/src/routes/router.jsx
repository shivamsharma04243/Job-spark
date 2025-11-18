import { createBrowserRouter } from "react-router-dom";

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
  { path: "/", element: <Home /> },
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
// recruiter
  {path: "dashboard/recruiter-profile", element: <RecruiterProfile />},
  {path: "dashboard/create-job", element: <RecruiterCreateJob />},
  {path: "dashboard/job-posted", element: <JobPosted />},
  {path: "dashboard/recruiter-dashboard", element: <RecruiterDashboard />},
  // premier talent hire
  {path: "/talent-hire", element: <TalentHire />},
  // user dashboard
  {path: "/dashboard/profile", element: <UserProfile />},
  {path: "/dashboard/saved", element: <Saved />},
  {path: "/dashboard/applied", element: <Applied />},
  {path: "/dashboard/alerts", element: <AlertsManage />},
 
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
  {
    path: "dashboard/job-posted",
    element: (
      <ProtectedRoute>
        <JobPosted />
      </ProtectedRoute>
    ),
  },
 
]);

export default router;
