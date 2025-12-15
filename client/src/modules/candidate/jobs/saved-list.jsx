import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Briefcase, GraduationCap, Star, Trash2, Eye } from 'lucide-react';
import api from '../../../components/apiconfig/apiconfig';

export default function Saved() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/jobs/saved-jobs');

      if (response.data.success) {
        setSavedJobs(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch saved jobs');
      }
    } catch (err) {
      console.error('Error fetching saved jobs:', err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Error fetching saved jobs. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeSavedJob = async (jobId) => {
    try {
      const response = await api.delete(`/jobs/save/${jobId}`);

      if (response.data.success) {
        setSavedJobs(prev => prev.filter(job => job.job_id !== jobId));
      } else {
        alert(response.data.message || 'Failed to remove job');
      }
    } catch (err) {
      console.error('Error removing job:', err);
      alert(err.message || 'Error removing job. Please try again.');
    }
  };

  const handleViewJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="card-padding">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex-1 space-y-3 w-full">
                  <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/5"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                  <div className="h-9 bg-gray-200 rounded w-full sm:w-24"></div>
                  <div className="h-9 bg-gray-200 rounded w-full sm:w-24"></div>
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
          <h3 className="text-lg font-semibold text-text-dark mb-2">Unable to Load Saved Jobs</h3>
          <p className="text-error-600 mb-6 text-sm">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={fetchSavedJobs}
              className="btn btn-primary btn-md"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate('/jobs')}
              className="btn btn-outline btn-md"
            >
              Browse Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">Saved Jobs</h2>
          <p className="text-sm sm:text-base text-text-muted mt-1">Your favorite job opportunities</p>
        </div>
        <div className="badge badge-primary text-sm">
          {savedJobs.length} Saved Job{savedJobs.length !== 1 ? 's' : ''}
        </div>
      </div>

      {savedJobs.length === 0 ? (
        <div className="card">
          <div className="card-padding text-center">
            <div className="text-warning-500 text-6xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold text-text-dark mb-2">No Saved Jobs Yet</h3>
            <p className="text-text-muted text-sm sm:text-base mb-6 max-w-md mx-auto">
              Start building your job collection! Save positions that interest you to review and apply later.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/jobs')}
                className="btn btn-primary btn-md"
              >
                Browse Jobs
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-outline btn-md"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((job) => (
            <div key={job.job_id} className="card card-hover">
              <div className="card-padding">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
                  {/* Job Details */}
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-text-dark">{job.title}</h3>
                      <span className="badge badge-warning inline-flex items-center gap-1 self-start">
                        <Star size={14} />
                        Saved
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-50 rounded-button flex items-center justify-center flex-shrink-0">
                          <Building2 size={18} className="text-primary-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-text-dark text-sm">{job.company}</p>
                          <p className="text-text-muted text-xs">Company</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-50 rounded-button flex items-center justify-center flex-shrink-0">
                          <MapPin size={18} className="text-primary-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-text-dark text-sm">{job.location}</p>
                          <p className="text-text-muted text-xs">Location</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-50 rounded-button flex items-center justify-center flex-shrink-0">
                          <Briefcase size={18} className="text-primary-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-text-dark text-sm">{job.type}</p>
                          <p className="text-text-muted text-xs">Job Type</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-50 rounded-button flex items-center justify-center flex-shrink-0">
                          <GraduationCap size={18} className="text-primary-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-text-dark text-sm">{job.experience || 'Not specified'}</p>
                          <p className="text-text-muted text-xs">Experience</p>
                        </div>
                      </div>
                    </div>

                    {job.salary && (
                      <div className="bg-success-light border border-success-300 rounded-lg p-3 mb-4">
                        <p className="text-success-dark font-semibold text-sm">
                          💰 {job.salary}
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-text-muted font-medium">
                      📅 Saved on {new Date(job.saved_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto lg:min-w-[120px]">
                    <button
                      onClick={() => handleViewJob(job.id)}
                      className="btn btn-outline btn-sm flex-1 sm:flex-none flex items-center justify-center gap-1.5"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button
                      onClick={() => removeSavedJob(job.job_id)}
                      className="btn btn-ghost btn-sm text-error-600 hover:text-error-700 hover:bg-error-light border-error-300 flex-1 sm:flex-none flex items-center justify-center gap-1.5"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
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