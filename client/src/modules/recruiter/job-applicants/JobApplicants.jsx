import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../components/apiconfig/apiconfig";

export default function JobApplicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (jobId) {
      fetchApplicants();
    }
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/recruiter/jobs/${jobId}/applicants`);
      if (data.ok) {
        setApplicants(data.applicants);
        // Also fetch job details
        const jobData = await api.get("/recruiter/jobs");
        if (jobData.data.ok) {
          const currentJob = jobData.data.jobs.find(j => j.id === parseInt(jobId));
          setJob(currentJob);
        }
      } else {
        setError("Failed to fetch applicants");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch applicants");
      console.error("Error fetching applicants:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-800',
      reviewed: 'bg-yellow-100 text-yellow-800',
      shortlisted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      hired: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const downloadResume = (resumePath, applicantName) => {
    if (resumePath) {
      const link = document.createElement('a');
      link.href = `/${resumePath}`;
      link.download = `${applicantName.replace(/\s+/g, '_')}_resume${resumePath.substring(resumePath.lastIndexOf('.'))}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl bg-white border border-gray-200">
            <div className="py-4 px-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Remove max-w-6xl mx-auto */}
      <div className="mb-6">
        <Link to="/job-posted" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Posted Jobs
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Applicants for {job?.title || 'Job'}
            </h1>
            {job && (
              <p className="text-gray-600 mt-2">
                {job.company} • {job.location} • {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {applicants.length === 0 ? (
        <div className="rounded-2xl text-center py-12 bg-white border border-gray-200">
          <div className="px-6">
            <div className="text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No applicants yet</h3>
            <p className="text-gray-600">No one has applied to this job yet.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {applicants.map((applicant) => (
            <div key={applicant.applicationId} className="rounded-2xl hover:shadow-md transition-shadow bg-white border border-gray-200">
              <div className="py-6 px-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-gray-600">
                          {applicant.user.fullName ? applicant.user.fullName.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {applicant.user.fullName || 'Anonymous User'}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(applicant.status)}`}>
                            {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div>
                            <strong>Email:</strong> {applicant.user.email}
                          </div>
                          {applicant.user.phone && (
                            <div>
                              <strong>Phone:</strong> {applicant.user.phone}
                            </div>
                          )}
                          {applicant.user.location && (
                            <div>
                              <strong>Location:</strong> {applicant.user.location}
                            </div>
                          )}
                          {applicant.user.experienceYears && (
                            <div>
                              <strong>Experience:</strong> {applicant.user.experienceYears} years
                            </div>
                          )}
                          {applicant.user.highestEducation && (
                            <div>
                              <strong>Education:</strong> {applicant.user.highestEducation}
                            </div>
                          )}
                        </div>

                        {applicant.coverLetter && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                              {applicant.coverLetter}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-3 mt-3">
                          {applicant.user.linkedinUrl && (
                            <a 
                              href={applicant.user.linkedinUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              LinkedIn
                            </a>
                          )}
                          {applicant.user.portfolioUrl && (
                            <a 
                              href={applicant.user.portfolioUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-800 text-sm"
                            >
                              Portfolio
                            </a>
                          )}
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                          Applied on {formatDate(applicant.appliedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-shrink-0">
                    {applicant.resumePath && (
                      <button 
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        onClick={() => downloadResume(applicant.resumePath, applicant.user.fullName || 'applicant')}
                      >
                        Download Resume
                      </button>
                    )}
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                      Contact
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

