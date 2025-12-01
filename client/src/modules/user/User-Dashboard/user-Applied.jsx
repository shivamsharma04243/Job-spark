import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { useEffect, useState } from "react";

// User Applied Jobs Dashboard Component
const statusColors = {
  applied: "bg-blue-100 text-blue-800 border border-blue-200",
  reviewed: "bg-purple-100 text-purple-800 border border-purple-200", 
  shortlisted: "bg-green-100 text-green-800 border border-green-200",
  rejected: "bg-red-100 text-red-800 border border-red-200",
  hired: "bg-emerald-100 text-emerald-800 border border-emerald-200"
};

const statusLabels = {
  applied: "Applied",
  reviewed: "Under Review", 
  shortlisted: "Shortlisted",
  rejected: "Rejected", 
  hired: "Hired"
};

// Main Applied Jobs Component
export default function Applied() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchAppliedJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/jobs/applied-jobs`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch applications: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.ok) {
        setApplications(data.applications || []);
      } else {
        throw new Error(data.error || 'Failed to load applications');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
              <p className="text-gray-600 text-lg">Tracking your job applications</p>
            </div>
            <div className="h-8 bg-blue-200 rounded-full w-24 animate-pulse"></div>
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="rounded-2xl border border-blue-200 shadow-lg animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-blue-200 rounded-xl"></div>
                      <div className="space-y-3 flex-1">
                        <div className="h-6 bg-blue-200 rounded w-1/3"></div>
                        <div className="h-4 bg-blue-200 rounded w-1/4"></div>
                        <div className="h-4 bg-blue-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-2 text-right">
                      <div className="h-8 bg-blue-200 rounded-full w-24"></div>
                      <div className="h-4 bg-blue-200 rounded w-20"></div>
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
              <p className="text-gray-600 text-lg">Tracking your job applications</p>
            </div>
          </div>

          <Card className="rounded-2xl border border-red-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Applications</h3>
              <p className="text-red-600 mb-6 text-lg">{error}</p>
              <Button 
                onClick={fetchAppliedJobs}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg"
              >
                Try Again
              </Button>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
            <p className="text-gray-600 text-lg">Track and manage your job applications</p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
            {applications.length} application{applications.length !== 1 ? 's' : ''}
          </div>
        </div>

        {applications.length === 0 ? (
          <Card className="rounded-2xl border border-blue-200 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="text-blue-400 text-8xl mb-6">📝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Applications Yet</h3>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                Start your job search journey! Apply to positions that match your skills and interests.
              </p>
              <div className="flex gap-4 justify-center">
                <a href="/jobs">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg">
                    Browse Jobs
                  </Button>
                </a>
                <a href="/dashboard/profile">
                  <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-3 text-lg rounded-lg">
                    Update Profile
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <Card key={application.id} className="rounded-2xl border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-6">
                    {/* Left Section - Job Details */}
                    <div className="flex items-start gap-4 flex-1">
                      {application.logo_path && (
                        <img 
                          src={application.logo_path} 
                          alt={application.company}
                          className="w-16 h-16 rounded-xl object-cover border border-blue-200"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-900 mb-2">
                          {application.title}
                        </h3>
                        <p className="text-gray-700 font-semibold text-lg mb-3">{application.company}</p>
                        <div className="flex items-center gap-6 text-gray-600">
                          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium border border-blue-200">
                            {application.job_type}
                          </span>
                          <span className="flex items-center gap-1">
                            📍 {getLocation(application)}
                          </span>
                          {application.salary && (
                            <span className="text-green-600 font-semibold">
                              💰 {application.salary}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Section - Status & Date */}
                    <div className="text-right space-y-3">
                      <Badge className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[application.status] || 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
                        {statusLabels[application.status] || application.status}
                      </Badge>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500 font-medium">
                          Applied on
                        </p>
                        <p className="text-gray-700 font-semibold">
                          {formatDate(application.applied_at)}
                        </p>
                      </div>
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