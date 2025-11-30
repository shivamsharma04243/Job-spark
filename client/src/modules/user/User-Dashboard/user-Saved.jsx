import { useState, useEffect } from 'react';
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import api from '../../../components/apiconfig/apiconfig'; // Import your axios instance

export default function Saved() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
// Fetch saved jobs from the backend API
  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching saved jobs...');
      const response = await api.get('/jobs/saved-jobs');
      
      console.log('Saved jobs response:', response.data);
      
      if (response.data.success) {
        setSavedJobs(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch saved jobs');
      }
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
      
      // Use the error message from the interceptor
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
      console.log('Removing saved job:', jobId);
      const response = await api.delete(`/jobs/save/${jobId}`);
      
      if (response.data.success) {
        // Remove from local state
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

  const handleApply = (jobId) => {
    navigate(`/jobs/${jobId}?apply=true`);
  };

  // Directly fetch saved jobs
  useEffect(() => {
    fetchSavedJobs();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold mb-4">Saved Jobs</h1>
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading saved jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold mb-4">Saved Jobs</h1>
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">{error}</p>
          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-600">Troubleshooting steps:</p>
            <ul className="text-sm text-gray-600 text-left max-w-md mx-auto">
              <li>• Make sure backend server is running on port 5000</li>
              <li>• Check if you're logged in</li>
              <li>• Verify API endpoints are correct</li>
              <li>• Check browser console for detailed errors</li>
            </ul>
          </div>
          <Button onClick={fetchSavedJobs}>Try Again</Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/jobs')}
            className="ml-2"
          >
            Browse Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold mb-2">Saved Jobs</h1>
      <p className="text-gray-600 mb-6">You have {savedJobs.length} saved job{savedJobs.length !== 1 ? 's' : ''}</p>
      
      {savedJobs.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <div className="text-gray-400 text-6xl mb-4">★</div>
          <p className="text-gray-500 text-lg mb-2">No saved jobs yet</p>
          <p className="text-gray-400 mb-6">Start saving jobs to see them here!</p>
          <Button onClick={() => navigate('/jobs')}>Browse Jobs</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((job) => (
            <Card key={job.job_id} className="rounded-2xl border hover:shadow-md transition-shadow">
              <CardContent className="py-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Building2 size={16} />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase size={16} />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GraduationCap size={16} />
                        <span>{job.experience}</span>
                      </div>
                    </div>

                    {job.salary && (
                      <p className="text-sm text-green-600 font-medium mb-2">
                        Salary: {job.salary}
                      </p>
                    )}

                    {job.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {job.description}
                      </p>
                    )}

                    <p className="text-xs text-gray-500">
                      Saved on {new Date(job.saved_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 flex-shrink-0">
                    <Button 
                      variant="secondary" 
                      onClick={() => handleViewJob(job.id)}
                    >
                      View
                    </Button>
                    <Button 
                      onClick={() => handleApply(job.id)}
                    >
                      Apply
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => removeSavedJob(job.job_id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}