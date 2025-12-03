import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white rounded-xl border border-slate-200 animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-6 bg-slate-200 rounded-full w-20"></div>
                  <div className="h-3 bg-slate-200 rounded w-16"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-white rounded-xl border border-slate-200">
        <CardContent className="p-6 text-center">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <h3 className="font-semibold text-slate-900 mb-2">Unable to Load Applications</h3>
          <p className="text-red-600 mb-4 text-sm">{error}</p>
          <Button 
            onClick={fetchAppliedJobs}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-sm"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">My Applications</h2>
          <p className="text-sm text-slate-600">Track and manage your job applications</p>
        </div>
        <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium">
          {applications.length} application{applications.length !== 1 ? 's' : ''}
        </div>
      </div>

      {applications.length === 0 ? (
        <Card className="bg-white rounded-xl border border-slate-200">
          <CardContent className="p-8 text-center">
            <div className="text-blue-400 text-5xl mb-4">📝</div>
            <h3 className="font-semibold text-slate-900 mb-2">No Applications Yet</h3>
            <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto">
              Start your job search journey! Apply to positions that match your skills and interests.
            </p>
            <div className="flex gap-3 justify-center">
              <Link to="/jobs">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-sm">
                  Browse Jobs
                </Button>
              </Link>
              <Link to="/dashboard/profile">
                <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 text-sm">
                  Update Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {applications.map((application) => (
            <Card key={application.id} className="bg-white rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  {/* Job Details */}
                  <div className="flex items-start gap-3 flex-1">
                    {application.logo_path && (
                      <img 
                        src={application.logo_path} 
                        alt={application.company}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 text-sm mb-1">
                        {application.title}
                      </h3>
                      <p className="text-slate-700 font-medium text-sm mb-2">{application.company}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-600">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                          {application.job_type}
                        </span>
                        <span className="flex items-center gap-1">
                          📍 {getLocation(application)}
                        </span>
                        {application.salary && (
                          <span className="text-green-600 font-medium">
                            💰 {application.salary}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Status & Date */}
                  <div className="text-right space-y-2">
                    <Badge className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[application.status] || 'bg-slate-100 text-slate-800 border border-slate-200'}`}>
                      {statusLabels[application.status] || application.status}
                    </Badge>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">
                        Applied on
                      </p>
                      <p className="text-slate-700 font-medium text-sm">
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
  );
}