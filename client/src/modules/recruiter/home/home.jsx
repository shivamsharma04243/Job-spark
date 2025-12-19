import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../components/apiconfig/apiconfig";
import {
  PlusCircle,
  Users,
  Briefcase,
  Clock,
  AlertCircle,
  ArrowRight,
  FileText,
  UserCheck,
  TrendingUp,
  Eye,
  ChevronRight,
  CheckCircle,
  XCircle,
  Bell,
  Calendar,
  MapPin,
  Building2,
} from "lucide-react";

export default function RecruiterDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user info
      const userRes = await api.get("/auth/session");
      if (userRes.data?.user) {
        setUser(userRes.data.user);
      }

      // Fetch comprehensive stats
      const statsRes = await api.get("/recruiter/jobs/stats");
      if (statsRes.data.ok) {
        setStats(statsRes.data.stats);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Format relative time
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Get status badge for applications
  const getStatusBadge = (status) => {
    const configs = {
      pending: { label: "New", class: "bg-blue-100 text-blue-700" },
      applied: { label: "New", class: "bg-blue-100 text-blue-700" },
      shortlisted: { label: "Shortlisted", class: "bg-green-100 text-green-700" },
      interviewed: { label: "Interviewed", class: "bg-purple-100 text-purple-700" },
      hired: { label: "Hired", class: "bg-emerald-100 text-emerald-700" },
      rejected: { label: "Rejected", class: "bg-red-100 text-red-700" },
    };
    const config = configs[status] || { label: status, class: "bg-gray-100 text-gray-700" };
    return (
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.class}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-20 bg-gray-200 rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-48 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const hasNoJobs = !stats?.totalJobs;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl">
      {/* Welcome Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {getGreeting()}, {user?.name || "Recruiter"}
            </h1>
            <p className="text-gray-500 text-sm">
              {hasNoJobs
                ? "Get started by posting your first job"
                : stats?.newApplications > 0
                  ? `${stats.newApplications} new application${stats.newApplications > 1 ? 's' : ''} this week`
                  : "Your hiring overview"}
            </p>
          </div>
          <Link
            to="/create-job"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            <PlusCircle size={16} />
            Post New Job
          </Link>
        </div>
      </div>

      {/* Empty State - No Jobs */}
      {hasNoJobs ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase size={32} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Start hiring today
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Post your first job to start receiving applications from qualified candidates.
          </p>
          <Link
            to="/create-job"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            <PlusCircle size={18} />
            Post Your First Job
          </Link>
        </div>
      ) : (
        <>
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              to="/job-posted"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.liveJobs || 0}</p>
                  <p className="text-xs text-gray-500">Live Jobs</p>
                </div>
              </div>
            </Link>

            <Link
              to="/job-posted"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalApplications || 0}</p>
                  <p className="text-xs text-gray-500">Total Applicants</p>
                </div>
              </div>
            </Link>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Clock size={20} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.pendingReview || 0}</p>
                  <p className="text-xs text-gray-500">To Review</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <UserCheck size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats?.shortlisted || 0}</p>
                  <p className="text-xs text-gray-500">Shortlisted</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Jobs & Applicants */}
            <div className="lg:col-span-2 space-y-6">
              {/* Your Live Jobs */}
              {stats?.liveJobsList?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase size={18} className="text-gray-500" />
                      <h3 className="font-semibold text-gray-800 text-sm">Your Live Jobs</h3>
                    </div>
                    <Link to="/job-posted" className="text-xs text-blue-600 hover:underline font-medium">
                      View all
                    </Link>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {stats.liveJobsList.slice(0, 5).map((job) => (
                      <div
                        key={job.id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{job.title}</h4>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Building2 size={12} />
                                {job.company}
                              </span>
                              {job.city && (
                                <span className="flex items-center gap-1">
                                  <MapPin size={12} />
                                  {job.city}
                                </span>
                              )}
                            </div>
                          </div>
                          <Link
                            to={`/recruiter/jobs/${job.id}/applicants`}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
                          >
                            <Users size={14} />
                            {job.totalApplications} Applicant{job.totalApplications !== 1 ? 's' : ''}
                          </Link>
                        </div>
                        {job.pendingCount > 0 && (
                          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-700">
                            <AlertCircle size={12} />
                            <span>{job.pendingCount} pending review</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Applicants */}
              {stats?.recentApplications?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-gray-500" />
                      <h3 className="font-semibold text-gray-800 text-sm">Recent Applicants</h3>
                    </div>
                    <Link to="/job-posted" className="text-xs text-blue-600 hover:underline font-medium">
                      View all
                    </Link>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {stats.recentApplications.map((app) => (
                      <Link
                        key={app.applicationId}
                        to={`/recruiter/jobs/${app.jobId}/applicants`}
                        className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                            {app.applicantName?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{app.applicantName}</p>
                            <p className="text-xs text-gray-500 truncate">Applied for {app.jobTitle}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {getStatusBadge(app.status)}
                          <span className="text-xs text-gray-400">{formatTimeAgo(app.appliedAt)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending Approval Jobs */}
              {stats?.pendingApprovalJobs?.length > 0 && (
                <div className="bg-white rounded-xl border border-amber-200 overflow-hidden">
                  <div className="bg-amber-50 px-4 py-3 border-b border-amber-200 flex items-center gap-2">
                    <Clock size={18} className="text-amber-600" />
                    <h3 className="font-semibold text-amber-800 text-sm">Awaiting Admin Approval</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {stats.pendingApprovalJobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between p-4"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{job.title}</p>
                          <p className="text-xs text-gray-500">{job.company} · Submitted {formatTimeAgo(job.createdAt)}</p>
                        </div>
                        <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full">
                          Under review
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Activity & Stats */}
            <div className="space-y-6">
              {/* Activity Feed */}
              {stats?.recentActivity?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                    <Bell size={18} className="text-gray-500" />
                    <h3 className="font-semibold text-gray-800 text-sm">Recent Activity</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    {stats.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${activity.type === 'new_application' ? 'bg-blue-500' : 'bg-green-500'
                          }`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 leading-tight">{activity.message}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{formatTimeAgo(activity.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hiring Pipeline */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                  <TrendingUp size={18} className="text-gray-500" />
                  <h3 className="font-semibold text-gray-800 text-sm">Hiring Pipeline</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">New Applications</span>
                    <span className="text-sm font-semibold text-gray-900">{stats?.pendingReview || 0}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min((stats?.pendingReview || 0) / Math.max(stats?.totalApplications || 1, 1) * 100, 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-gray-600">Shortlisted</span>
                    <span className="text-sm font-semibold text-gray-900">{stats?.shortlisted || 0}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${Math.min((stats?.shortlisted || 0) / Math.max(stats?.totalApplications || 1, 1) * 100, 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-gray-600">Interviewed</span>
                    <span className="text-sm font-semibold text-gray-900">{stats?.interviewed || 0}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${Math.min((stats?.interviewed || 0) / Math.max(stats?.totalApplications || 1, 1) * 100, 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-gray-600">Hired</span>
                    <span className="text-sm font-semibold text-emerald-600">{stats?.hired || 0}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${Math.min((stats?.hired || 0) / Math.max(stats?.totalApplications || 1, 1) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Job Stats Summary */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Jobs Summary</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
                    <p className="text-lg font-bold text-green-600">{stats?.liveJobs || 0}</p>
                    <p className="text-xs text-gray-500">Live</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
                    <p className="text-lg font-bold text-amber-600">{stats?.pendingJobs || 0}</p>
                    <p className="text-xs text-gray-500">Pending</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
                    <p className="text-lg font-bold text-gray-600">{stats?.closedJobs || 0}</p>
                    <p className="text-xs text-gray-500">Closed</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
                    <p className="text-lg font-bold text-gray-900">{stats?.totalJobs || 0}</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
