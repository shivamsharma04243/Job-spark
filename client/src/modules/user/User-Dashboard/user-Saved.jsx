import { useState, useEffect } from 'react';
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Briefcase, GraduationCap, Star, Trash2, Eye, Rocket } from 'lucide-react';
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

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
              <p className="text-gray-600 text-lg">Your favorite job opportunities</p>
            </div>
            <div className="h-8 bg-blue-200 rounded-full w-32 animate-pulse"></div>
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="rounded-2xl border border-blue-200 shadow-lg animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="h-6 bg-blue-200 rounded w-1/3"></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-4 bg-blue-200 rounded w-3/4"></div>
                        <div className="h-4 bg-blue-200 rounded w-2/3"></div>
                        <div className="h-4 bg-blue-200 rounded w-1/2"></div>
                        <div className="h-4 bg-blue-200 rounded w-3/5"></div>
                      </div>
                      <div className="h-4 bg-blue-200 rounded w-1/4"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-10 bg-blue-200 rounded w-24"></div>
                      <div className="h-10 bg-blue-200 rounded w-24"></div>
                      <div className="h-10 bg-blue-200 rounded w-24"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
              <p className="text-gray-600 text-lg">Your favorite job opportunities</p>
            </div>
          </div>

          <Card className="rounded-2xl border border-red-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load Saved Jobs</h3>
              <p className="text-red-600 mb-6 text-lg">{error}</p>
              
              <div className="bg-blue-50 rounded-xl p-6 mb-6 text-left max-w-2xl mx-auto">
                <h4 className="font-semibold text-gray-900 mb-3">Troubleshooting Steps:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Make sure backend server is running on port 5000
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Check if you're logged in to your account
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Verify API endpoints are correctly configured
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Check browser console for detailed error messages
                  </li>
                </ul>
              </div>

              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={fetchSavedJobs}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg"
                >
                  Try Again
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/jobs')}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-3 text-lg rounded-lg"
                >
                  Browse Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
            <p className="text-gray-600 text-lg">Your favorite job opportunities</p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-6 py-3 rounded-full font-bold text-lg">
            {savedJobs.length} Saved Job{savedJobs.length !== 1 ? 's' : ''}
          </div>
        </div>

        {savedJobs.length === 0 ? (
          <Card className="rounded-2xl border border-blue-200 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="text-yellow-400 text-8xl mb-6">⭐</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Saved Jobs Yet</h3>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                Start building your job collection! Save positions that interest you to review and apply later.
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/jobs')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg flex items-center"
                >
                  <Rocket className="mr-2" size={20} />
                  Browse Jobs
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-3 text-lg rounded-lg"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {savedJobs.map((job) => (
              <Card key={job.job_id} className="rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-6">
                    {/* Job Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-bold text-xl text-gray-900 mb-2">{job.title}</h3>
                        <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-200 px-3 py-1">
                          <Star className="w-4 h-4 mr-1" />
                          Saved
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{job.company}</p>
                            <p className="text-sm text-gray-600">Company</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <MapPin size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{job.location}</p>
                            <p className="text-sm text-gray-600">Location</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Briefcase size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{job.type}</p>
                            <p className="text-sm text-gray-600">Job Type</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-700">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <GraduationCap size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{job.experience}</p>
                            <p className="text-sm text-gray-600">Experience</p>
                          </div>
                        </div>
                      </div>

                      {job.salary && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                          <p className="text-green-800 font-semibold text-lg">
                            💰 {job.salary}
                          </p>
                        </div>
                      )}

                      {job.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>
                      )}

                      <p className="text-sm text-gray-500 font-medium">
                        📅 Saved on {new Date(job.saved_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 flex-shrink-0 min-w-[140px]">
                      <Button 
                        variant="outline" 
                        onClick={() => handleViewJob(job.id)}
                        className="border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center justify-center"
                      >
                        <Eye className="mr-2" size={16} />
                        View
                      </Button>
                      <Button 
                        onClick={() => handleApply(job.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
                      >
                        <Rocket className="mr-2" size={16} />
                        Apply
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => removeSavedJob(job.job_id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 flex items-center justify-center"
                      >
                        <Trash2 className="mr-2" size={16} />
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
    </div>
  );
}