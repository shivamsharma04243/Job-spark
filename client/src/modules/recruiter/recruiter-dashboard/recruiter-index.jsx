import { useState, useEffect } from "react";
import api from "../../../components/apiconfig/apiconfig";

export default function RecruiterDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    recentApplications: 0,
    recentActivity: [],
    shortlisted: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsResponse = await api.get("/recruiter/stats");
      if (statsResponse.data.ok) {
        setStats(statsResponse.data.stats);
      }

      // Fetch recent jobs
      const jobsResponse = await api.get("/recruiter/jobs?limit=3");
      if (jobsResponse.data.ok) {
        setRecentJobs(jobsResponse.data.jobs || []);
      }

      // Fetch recent applicants
      const applicantsResponse = await api.get("/recruiter/recent-applicants");
      if (applicantsResponse.data.ok) {
        setRecentApplicants(applicantsResponse.data.applicants || []);
      }

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Format time ago utility
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };                              

  return (
    <section className="p-4 md:p-8 space-y-6">
      {/* Mobile Header */}
      <div className="md:hidden mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recruiter Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your hiring overview</p>
      </div>

      {/* Stats Grid - Matching your HTML design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Active jobs</p>
          <p className="mt-2 text-2xl font-semibold">
            {loading ? '...' : stats.totalJobs}
          </p>
          <p className="mt-1 text-xs text-slate-500">Currently live on platform</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">New applicants (7 days)</p>
          <p className="mt-2 text-2xl font-semibold">
            {loading ? '...' : stats.recentApplications}
          </p>
          <p className="mt-1 text-xs text-slate-500">Across all open roles</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500">Shortlisted</p>
          <p className="mt-2 text-2xl font-semibold">
            {loading ? '...' : stats.shortlisted}
          </p>
          <p className="mt-1 text-xs text-slate-500">Waiting for next step</p>
        </div>
      </div>

      {/* Recent jobs */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Recent job posts</h3>
          <a href="/job-posted" className="text-xs text-slate-500 hover:underline">Manage all jobs</a>
        </div>
        <div className="space-y-3 text-sm">
          {loading ? (
            <div className="text-center py-4">
              <p className="text-gray-500">Loading jobs...</p>
            </div>
          ) : recentJobs.length > 0 ? (
            recentJobs.map((job) => (
              <div key={job.id} className="flex items-center justify-between border border-slate-100 rounded-lg p-3">
                <div>
                  <p className="font-medium">{job.title}</p>
                  <p className="text-xs text-slate-500">
                    {job.applicationCount || 0} applicants • Posted {formatDate(job.createdAt)}
                  </p>
                </div>
                <a 
                  href={`/recruiter/jobs/${job.id}/applicants`}
                  className="text-xs px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50"
                >
                  View applicants
                </a>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No jobs posted yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent applicants */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Recent applicants</h3>
          <a href="/applicants" className="text-xs text-slate-500 hover:underline">Go to Applicants</a>
        </div>
        <div className="space-y-3 text-xs">
          {loading ? (
            <div className="text-center py-2">
              <p className="text-gray-500">Loading applicants...</p>
            </div>
          ) : recentApplicants.length > 0 ? (
            recentApplicants.map((applicant, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">
                    {applicant.user?.fullName || applicant.name || 'Anonymous'}
                  </p>
                  <p className="text-slate-500">
                    Applied for {applicant.jobTitle || 'a job'}
                  </p>
                </div>
                <p className="text-slate-400">
                  {formatTimeAgo(applicant.appliedAt || applicant.createdAt)}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-2">
              <p className="text-gray-500">No recent applicants</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Recent Activity</h3>
          <a href="/activity" className="text-xs text-slate-500 hover:underline">View all</a>
        </div>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4">
              <p className="text-gray-500">Loading activity...</p>
            </div>
          ) : stats.recentActivity && stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">{activity.message}</span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}