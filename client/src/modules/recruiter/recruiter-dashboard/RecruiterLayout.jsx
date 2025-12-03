import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import RecruiterSidebar from "../../recruiter/recruiter-dashboard/recruitersidebar.jsx";
export default function RecruiterLayout() {
  const location = useLocation();

  // Check if current route is active for mobile tabs
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Get page title based on current route
  const getPageTitle = () => {
    if (location.pathname === '/recruiter-dashboard') return 'Dashboard';
    if (location.pathname === '/job-posted') return 'Posted Jobs';
    if (location.pathname === '/create-job') return 'Create Job';
    if (location.pathname.includes('/applicants')) return 'Applicants';
    if (location.pathname === '/recruiter-profile') return 'Company Profile';
    if (location.pathname === '/talent-hire') return 'Talent Hire';
    if (location.pathname === '/recruiter-profileform') return 'Complete Profile';
    return 'Recruiter Dashboard';
  };

  // Get page description based on current route
  const getPageDescription = () => {
    if (location.pathname === '/recruiter-dashboard') return 'Quick overview of your hiring activity.';
    if (location.pathname === '/job-posted') return 'Manage your job postings and applicants.';
    if (location.pathname === '/create-job') return 'Create a new job posting.';
    if (location.pathname.includes('/applicants')) return 'Review and manage applicants.';
    if (location.pathname === '/recruiter-profile') return 'Update your company profile and settings.';
    if (location.pathname === '/talent-hire') return 'Find and hire top talent.';
    if (location.pathname === '/recruiter-profileform') return 'Complete your company profile to get started.';
    return 'Manage your recruiting activities.';
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <RecruiterSidebar />

      {/* Mobile top nav */}
      <header className="md:hidden fixed inset-x-0 top-0 z-20 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-semibold">HireSpark</span>
          <span className="text-xs text-slate-500">Recruiter</span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col bg-slate-50 md:pt-0 pt-16 md:ml-20 lg:ml-64 transition-all duration-300">
        {/* Top bar for desktop */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 border-b border-slate-200 bg-white">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              {getPageTitle()}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {getPageDescription()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to="/create-job"
              className="px-3 py-1.5 text-sm rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              + Post Job
            </Link>
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
              R
            </div>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex flex-wrap gap-3 p-4 border-b border-gray-200 overflow-x-auto">
          <Link 
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${isActive('/recruiter-dashboard') ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`} 
            to="/recruiter-dashboard"
          >
            Overview
          </Link>
          <Link 
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${isActive('/recruiter-profile') ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`} 
            to="/recruiter-profile"
          >
            Profile
          </Link>
          <Link 
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${isActive('/job-posted') ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`} 
            to="/job-posted"
          >
            Posted Jobs
          </Link>
          <Link 
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${isActive('/create-job') ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`} 
            to="/create-job"
          >
            Create Job
          </Link>
        </div>

        {/* Content area where child components will render */}
        <div className="flex-1 p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}