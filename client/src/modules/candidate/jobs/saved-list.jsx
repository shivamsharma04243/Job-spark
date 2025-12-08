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
          <div key={i} className="bg-white rounded-xl border border-slate-200 animate-pulse">
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-200 rounded w-3/5"></div>
                  </div>
                  <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-8 bg-slate-200 rounded w-20"></div>
                  <div className="h-8 bg-slate-200 rounded w-20"></div>
                  <div className="h-8 bg-slate-200 rounded w-20"></div>
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
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="p-6 text-center">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <h3 className="font-semibold text-slate-900 mb-2">Unable to Load Saved Jobs</h3>
          <p className="text-red-600 mb-4 text-sm">{error}</p>
          <button 
            onClick={fetchSavedJobs}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-sm mr-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
          <button 
            onClick={() => navigate('/jobs')}
            className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 text-sm rounded-lg transition-colors"
          >
            Browse Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Saved Jobs</h2>
          <p className="text-sm text-slate-600">Your favorite job opportunities</p>
        </div>
        <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium">
          {savedJobs.length} Saved Job{savedJobs.length !== 1 ? 's' : ''}
        </div>
      </div>

      {savedJobs.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-8 text-center">
            <div className="text-yellow-400 text-5xl mb-4">⭐</div>
            <h3 className="font-semibold text-slate-900 mb-2">No Saved Jobs Yet</h3>
            <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto">
              Start building your job collection! Save positions that interest you to review and apply later.
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={() => navigate('/jobs')}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-sm rounded-lg transition-colors"
              >
                Browse Jobs
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 text-sm rounded-lg transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {savedJobs.map((job) => (
            <div key={job.job_id} className="bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  {/* Job Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-slate-900 text-sm mb-1">{job.title}</h3>
                      <span className="inline-flex items-center bg-yellow-100 text-yellow-800 border border-yellow-200 px-2 py-0.5 text-xs rounded-full">
                        <Star className="w-3 h-3 mr-1" />
                        Saved
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-slate-700">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <Building2 size={14} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-xs">{job.company}</p>
                          <p className="text-slate-500 text-xs">Company</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-slate-700">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <MapPin size={14} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-xs">{job.location}</p>
                          <p className="text-slate-500 text-xs">Location</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-slate-700">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <Briefcase size={14} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-xs">{job.type}</p>
                          <p className="text-slate-500 text-xs">Job Type</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-slate-700">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <GraduationCap size={14} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-xs">{job.experience}</p>
                          <p className="text-slate-500 text-xs">Experience</p>
                        </div>
                      </div>
                    </div>

                    {job.salary && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
                        <p className="text-green-700 font-medium text-sm">
                          💰 {job.salary}
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-slate-500 font-medium mb-2">
                      📅 Saved on {new Date(job.saved_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 min-w-[100px]">
                    <button 
                      onClick={() => handleViewJob(job.id)}
                      className="border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs px-3 py-1.5 h-auto rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </button>
                    <button 
                      onClick={() => removeSavedJob(job.job_id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-300 text-xs px-3 py-1.5 h-auto rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
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