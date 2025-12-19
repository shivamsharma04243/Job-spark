import { useState, useEffect, useRef } from "react";
import api from "../../../components/apiconfig/apiconfig";
import { Link } from "react-router-dom";
import {
  MoreVertical,
  Eye,
  XCircle,
  Trash2,
  Users,
  Briefcase,
  Clock,
  AlertCircle,
  CheckCircle2,
  Ban,
  FileX,
  PlusCircle,
} from "lucide-react";

// Status badge configurations
const STATUS_CONFIG = {
  pending: {
    label: "Pending Approval",
    className: "bg-amber-100 text-amber-800",
    icon: Clock,
  },
  approved: {
    label: "Live",
    className: "bg-green-100 text-green-800",
    icon: CheckCircle2,
  },
  closed: {
    label: "Closed",
    className: "bg-gray-100 text-gray-800",
    icon: Ban,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800",
    icon: XCircle,
  },
  withdrawn: {
    label: "Withdrawn",
    className: "bg-slate-100 text-slate-800",
    icon: FileX,
  },
};

// Format relative date
const formatRelativeDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

export default function JobPosted() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null); // jobId being acted upon
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchPostedJobs();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchPostedJobs = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/recruiter/jobs");

      if (data.ok) {
        setJobs(data.jobs);
      } else {
        setError("Failed to fetch jobs");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch jobs");
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseJob = async (jobId) => {
    if (!confirm("Are you sure you want to close this job? This action cannot be undone.")) {
      return;
    }

    try {
      setActionLoading(jobId);
      setOpenMenuId(null);
      const { data } = await api.put(`/recruiter/jobs/${jobId}/status`, { action: "close" });

      if (data.ok) {
        // Update local state
        setJobs((prev) =>
          prev.map((job) => (job.id === jobId ? { ...job, status: "closed" } : job))
        );
      } else {
        alert(data.message || "Failed to close job");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to close job");
    } finally {
      setActionLoading(null);
    }
  };

  const handleWithdrawJob = async (jobId) => {
    if (!confirm("Are you sure you want to withdraw this job from review? This action cannot be undone.")) {
      return;
    }

    try {
      setActionLoading(jobId);
      setOpenMenuId(null);
      const { data } = await api.put(`/recruiter/jobs/${jobId}/status`, { action: "withdraw" });

      if (data.ok) {
        // Update local state
        setJobs((prev) =>
          prev.map((job) => (job.id === jobId ? { ...job, status: "withdrawn" } : job))
        );
      } else {
        alert(data.message || "Failed to withdraw job");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to withdraw job");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusConfig = (status) => {
    return STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl bg-white border border-gray-200 p-5 mb-4">
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Jobs</h1>
          <p className="text-gray-600 text-sm mt-1">
            {jobs.length} job{jobs.length !== 1 ? "s" : ""} posted
          </p>
        </div>
        <Link
          to="/create-job"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          <PlusCircle size={18} />
          Post New Job
        </Link>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-center gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {jobs.length === 0 ? (
        <div className="rounded-xl text-center py-16 bg-white border border-gray-200">
          <div className="px-6">
            <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
            <p className="text-gray-600 mb-6">Start by creating your first job posting</p>
            <Link
              to="/create-job"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              <PlusCircle size={18} />
              Post Your First Job
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const statusConfig = getStatusConfig(job.status);
            const StatusIcon = statusConfig.icon;
            const isLive = job.status === "approved";
            const isPending = job.status === "pending";
            const isRejected = job.status === "rejected";
            const isActionable = isLive || isPending;

            return (
              <div
                key={job.id}
                className={`rounded-xl bg-white border transition-shadow ${actionLoading === job.id ? "opacity-60 pointer-events-none" : "hover:shadow-md"
                  } ${isRejected ? "border-red-200" : "border-gray-200"}`}
              >
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Job Info */}
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <h3 className="font-semibold text-lg text-gray-900 truncate">{job.title}</h3>

                      {/* Company · City · Job Type · Work Mode */}
                      <p className="text-gray-600 text-sm mt-1 truncate">
                        {job.company}
                        {job.city && ` · ${job.city}`}
                        {job.type && ` · ${job.type}`}
                        {job.workMode && ` · ${job.workMode}`}
                      </p>

                      {/* Status + Meta row */}
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.className}`}
                        >
                          <StatusIcon size={14} />
                          {statusConfig.label}
                        </span>

                        {/* Posted date */}
                        <span className="text-xs text-gray-500">
                          Posted {formatRelativeDate(job.createdAt)}
                        </span>

                        {/* Openings */}
                        <span className="text-xs text-gray-500">
                          {job.vacancies || 0} opening{job.vacancies !== 1 ? "s" : ""}
                        </span>

                        {/* Applicants count */}
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                          <Users size={14} />
                          {job.applicationCount || 0} applicant{job.applicationCount !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Pending approval note */}
                      {isPending && (
                        <div className="mt-3 flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-2 rounded-lg text-sm">
                          <Clock size={16} />
                          This job is under admin review.
                        </div>
                      )}

                      {/* Rejection reason */}
                      {isRejected && job.rejectionReason && (
                        <div className="mt-3 flex items-start gap-2 text-red-700 bg-red-50 px-3 py-2 rounded-lg text-sm">
                          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                          <span>
                            <strong>Rejection reason:</strong> {job.rejectionReason}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Primary Action: View Applicants (only for Live jobs) */}
                      {isLive && (
                        <Link
                          to={`/recruiter/jobs/${job.id}/applicants`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
                        >
                          <Users size={14} />
                          Applicants ({job.applicationCount || 0})
                        </Link>
                      )}

                      {/* 3-dot Menu */}
                      <div className="relative" ref={openMenuId === job.id ? menuRef : null}>
                        <button
                          onClick={() => setOpenMenuId(openMenuId === job.id ? null : job.id)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          aria-label="More actions"
                        >
                          <MoreVertical size={20} />
                        </button>

                        {openMenuId === job.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                            {/* View Job - Always available */}
                            <Link
                              to={`/jobs/${job.id}`}
                              onClick={() => setOpenMenuId(null)}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              <Eye size={16} />
                              View Job
                            </Link>

                            {/* Close Job - Only for Live jobs */}
                            {isLive && (
                              <button
                                onClick={() => handleCloseJob(job.id)}
                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <XCircle size={16} />
                                Close Job
                              </button>
                            )}

                            {/* Withdraw Job - Only for Pending jobs */}
                            {isPending && (
                              <button
                                onClick={() => handleWithdrawJob(job.id)}
                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 transition-colors"
                              >
                                <Trash2 size={16} />
                                Withdraw Job
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
