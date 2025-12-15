import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Building2, MapPin, Briefcase, Clock, CheckCircle2 } from 'lucide-react';
import api from '../../../components/apiconfig/apiconfig';

const statusColors = {
  applied: "badge-primary",
  reviewed: "badge badge bg-purple-50 text-purple-700 border border-purple-200",
  shortlisted: "badge-success",
  rejected: "badge badge bg-error-light text-error-dark border border-error-300",
  hired: "badge badge bg-emerald-50 text-emerald-700 border border-emerald-200"
};

const statusLabels = {
  applied: "Applied",
  reviewed: "Under Review",
  shortlisted: "Shortlisted",
  rejected: "Rejected",
  hired: "Hired"
};

export default function Applied() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppliedJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/jobs/applied-jobs');

      if (response.data.ok) {
        setApplications(response.data.applications || []);
      } else {
        throw new Error(response.data.error || 'Failed to load applications');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err?.response?.data?.error || err?.response?.data?.message || err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getLocation = (application) => {
    if (application.city && application.locality) {
      return `${application.city}, ${application.locality}`;
    }
    return application.city || application.locality || 'Location not specified';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="card-padding">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 w-full">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col gap-2 text-left sm:text-right w-full sm:w-auto">
                  <div className="h-7 bg-gray-200 rounded-full w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-padding text-center">
          <div className="text-error-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-text-dark mb-2">Unable to Load Applications</h3>
          <p className="text-error-600 mb-6 text-sm">{error}</p>
          <button
            onClick={fetchAppliedJobs}
            className="btn btn-primary btn-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">My Applications</h2>
          <p className="text-sm sm:text-base text-text-muted mt-1">Track and manage your job applications</p>
        </div>
        <div className="badge badge-primary text-sm">
          {applications.length} application{applications.length !== 1 ? 's' : ''}
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="card">
          <div className="card-padding text-center">
            <div className="text-primary-500 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-text-dark mb-2">No Applications Yet</h3>
            <p className="text-text-muted text-sm sm:text-base mb-6 max-w-md mx-auto">
              Start your job search journey! Apply to positions that match your skills and interests.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/jobs" className="btn btn-primary btn-md">
                Browse Jobs
              </Link>
              <Link to="/dashboard/profile" className="btn btn-outline btn-md">
                Update Profile
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application.id} className="card card-hover">
              <div className="card-padding">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                  {/* Job Details */}
                  <div className="flex items-start gap-4 flex-1 w-full">
                    {application.logo_path ? (
                      <img
                        src={application.logo_path}
                        alt={application.company}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover border border-border flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center flex-shrink-0">
                        <Building2 size={24} className="text-primary-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold text-text-dark mb-1.5">
                        {application.title}
                      </h3>
                      <p className="text-text-dark font-medium text-sm sm:text-base mb-3">{application.company}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                        <span className="badge badge-primary">
                          <Briefcase size={12} className="inline mr-1" />
                          {application.job_type}
                        </span>
                        <span className="badge badge-gray inline-flex items-center gap-1">
                          <MapPin size={12} />
                          {getLocation(application)}
                        </span>
                        {application.salary && (
                          <span className="badge badge-success">
                            💰 {application.salary}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status & Date */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-2 w-full sm:w-auto lg:min-w-[140px]">
                    <span className={`${statusColors[application.status] || 'badge badge-gray'} text-xs`}>
                      {statusLabels[application.status] || application.status}
                    </span>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-text-muted font-medium mb-0.5">
                        Applied on
                      </p>
                      <p className="text-text-dark font-semibold text-sm inline-flex items-center gap-1">
                        <Clock size={14} />
                        {formatDate(application.applied_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}