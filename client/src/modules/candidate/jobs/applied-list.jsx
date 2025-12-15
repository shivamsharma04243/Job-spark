import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Building2, MapPin, Briefcase, Clock } from 'lucide-react';
import api from '../../../components/apiconfig/apiconfig';

const statusColors = {
  applied: "bg-blue-50 text-blue-700 border-blue-200",
  reviewed: "bg-purple-50 text-purple-700 border-purple-200",
  shortlisted: "bg-amber-50 text-amber-700 border-amber-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  hired: "bg-emerald-50 text-emerald-700 border-emerald-200"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="p-6">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-6 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="card-padding text-center py-12">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-text-dark mb-2">Unable to Load Applications</h3>
            <p className="text-red-600 mb-6 text-sm">{error}</p>
            <button onClick={fetchAppliedJobs} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-dark">My Applications</h1>
            <p className="text-text-muted mt-1">Track your job applications</p>
          </div>
          <div className="badge badge-primary">
            {applications.length} Total
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="card">
            <div className="card-padding text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-text-dark mb-2">No Applications Yet</h3>
              <p className="text-text-muted mb-6">
                Start your job search journey! Apply to positions that match your skills.
              </p>
              <div className="flex gap-3 justify-center">
                <Link to="/jobs" className="btn btn-primary">
                  Browse Jobs
                </Link>
                <Link to="/dashboard/profile" className="btn btn-outline">
                  Update Profile
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div key={application.id} className="card hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                    {/* Company Logo */}
                    {application.logo_path ? (
                      <img
                        src={application.logo_path}
                        alt={application.company}
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center">
                        <Building2 size={28} className="text-primary-600" />
                      </div>
                    )}

                    {/* Job Info */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-text-dark mb-1">
                            {application.title}
                          </h3>
                          <p className="text-base font-semibold text-gray-700">{application.company}</p>
                        </div>
                        <span className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${statusColors[application.status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                          {statusLabels[application.status] || application.status}
                        </span>
                      </div>

                      {/* Job Details */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-200">
                          <Briefcase size={14} />
                          {application.job_type}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-700 rounded-lg text-sm border border-gray-200">
                          <MapPin size={14} />
                          {getLocation(application)}
                        </span>
                        {application.salary && (
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm border border-emerald-200">
                            💰 {application.salary}
                          </span>
                        )}
                      </div>

                      {/* Applied Date */}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={16} />
                        <span>Applied on {formatDate(application.applied_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
