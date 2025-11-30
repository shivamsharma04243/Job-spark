import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { useEffect, useState } from "react";
// User Applied Jobs Dashboard Component
const statusColors = {
  applied: "bg-blue-100 text-blue-800",
  reviewed: "bg-purple-100 text-purple-800",
  shortlisted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  hired: "bg-emerald-100 text-emerald-800"
};
// Mapping of status codes to human-readable labels
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
// Format date to a readable string
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
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold mb-4">My Applications</h1>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="rounded-2xl animate-pulse">
              <CardContent className="py-4 flex items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold mb-4">My Applications</h1>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={fetchAppliedJobs}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold">My Applications</h1>
        <div className="text-sm text-gray-600">
          {applications.length} application{applications.length !== 1 ? 's' : ''}
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No applications yet</h3>
          <p className="text-gray-500">Start applying to jobs to see them here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id} className="rounded-2xl hover:shadow-md transition-shadow">
              <CardContent className="py-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      {application.logo_path && (
                        <img 
                          src={application.logo_path} 
                          alt={application.company}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {application.title}
                        </h3>
                        <p className="text-gray-600">{application.company}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span>{application.job_type}</span>
                          <span>•</span>
                          <span>{getLocation(application)}</span>
                          {application.salary && (
                            <>
                              <span>•</span>
                              <span>{application.salary}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className={`rounded-full ${statusColors[application.status] || 'bg-gray-100 text-gray-800'}`}>
                      {statusLabels[application.status] || application.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-2">
                      Applied {formatDate(application.applied_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}