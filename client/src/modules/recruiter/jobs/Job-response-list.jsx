import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../components/apiconfig/apiconfig";

export default function JobApplicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedDetails, setExpandedDetails] = useState({});
  const [showInterviewModal, setShowInterviewModal] = useState(null);
  const [interviewForm, setInterviewForm] = useState({
    date: "",
    time: "",
    message: ""
  });

  useEffect(() => {
    if (jobId) {
      fetchApplicants();
    }
  }, [jobId]);

  // Auto-close applications after 14 days if status is interview_called
  // Note: This is a simple client-side check. For production, this should be handled by a backend cron job
  const checkAndCloseStaleInterviews = async (applicantsList) => {
    const now = new Date();
    const staleInterviews = [];

    applicantsList.forEach(app => {
      if (app.status === 'interview_called' && app.updatedAt) {
        const updatedDate = new Date(app.updatedAt);
        const daysSinceUpdate = (now - updatedDate) / (1000 * 60 * 60 * 24);

        if (daysSinceUpdate >= 14) {
          staleInterviews.push(app.applicationId);
        }
      }
    });

    // Update all stale interviews
    if (staleInterviews.length > 0) {
      for (const applicationId of staleInterviews) {
        try {
          await updateApplicationStatus(applicationId, 'closed');
        } catch (err) {
          console.error('Error auto-closing stale interview:', err);
        }
      }
    }
  };

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/recruiter/jobs/${jobId}/applicants`);
      if (data.ok) {
        const fetchedApplicants = data.applicants;
        setApplicants(fetchedApplicants);

        // Check for stale interviews and auto-close them
        await checkAndCloseStaleInterviews(fetchedApplicants);

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

  const getStatusInfo = (status) => {
    const statusMap = {
      applied: {
        label: 'New Applicant',
        color: 'bg-blue-100 text-blue-800 border border-blue-200'
      },
      shortlisted: {
        label: 'Shortlisted',
        color: 'bg-green-100 text-green-800 border border-green-200'
      },
      interview_called: {
        label: 'Interview Called',
        color: 'bg-purple-100 text-purple-800 border border-purple-200'
      },
      closed: {
        label: 'Closed by System',
        color: 'bg-gray-100 text-gray-800 border border-gray-200'
      }
    };
    return statusMap[status] || {
      label: status.charAt(0).toUpperCase() + status.slice(1),
      color: 'bg-gray-100 text-gray-800 border border-gray-200'
    };
  };

  const getAvailabilityText = (availability) => {
    if (!availability) return "Availability not specified";

    const availabilityMap = {
      'Immediately': 'Can join immediately',
      'Within 7 Days': 'Can join in 7 days',
      'Within 15 Days': 'Can join in 15 days'
    };

    return availabilityMap[availability] || `Can join ${availability}`;
  };

  const toggleDetails = (applicationId) => {
    setExpandedDetails(prev => ({
      ...prev,
      [applicationId]: !prev[applicationId]
    }));
  };

  const handleCall = (applicant) => {
    if (applicant.user.phone) {
      window.location.href = `tel:${applicant.user.phone}`;
    }
  };

  const handleWhatsApp = (applicant) => {
    if (applicant.user.phone) {
      const phoneNumber = applicant.user.phone.replace(/\D/g, ''); // Remove non-digits
      const message = encodeURIComponent(`Hello ${applicant.user.fullName}, I'm calling regarding your job application.`);
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus, interviewData = null) => {
    try {
      const payload = { status: newStatus };
      if (interviewData) {
        payload.interviewDate = interviewData.date;
        payload.interviewTime = interviewData.time;
        payload.interviewMessage = interviewData.message;
      }

      const { data } = await api.put(
        `/recruiter/jobs/applications/${applicationId}/status`,
        payload
      );

      if (data.ok) {
        setApplicants(prev => prev.map(app =>
          app.applicationId === applicationId
            ? { ...app, status: newStatus, updatedAt: new Date().toISOString() }
            : app
        ));
        if (showInterviewModal) {
          setShowInterviewModal(null);
          setInterviewForm({ date: "", time: "", message: "" });
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err.response?.data?.message || "Failed to update status. Please try again.");
      return false;
    }
  };

  const handleShortlist = async (applicationId) => {
    await updateApplicationStatus(applicationId, 'shortlisted');
  };

  const handleCallNowClick = (applicant) => {
    if (applicant.status === 'shortlisted') {
      // Show modal to mark as interview called
      setShowInterviewModal(applicant.applicationId);
    } else {
      // Just make the call
      handleCall(applicant);
    }
  };

  const handleMarkInterviewCalled = () => {
    if (!interviewForm.date || !interviewForm.time) {
      alert("Please fill in interview date and time");
      return;
    }

    updateApplicationStatus(showInterviewModal, 'interview_called', interviewForm);
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
      {/* Header */}
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

      {/* Interview Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Mark Interview Called</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interview Date *
                </label>
                <input
                  type="date"
                  value={interviewForm.date}
                  onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interview Time *
                </label>
                <input
                  type="time"
                  value={interviewForm.time}
                  onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message/Instructions (Optional)
                </label>
                <textarea
                  value={interviewForm.message}
                  onChange={(e) => setInterviewForm({ ...interviewForm, message: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Add interview details or instructions..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowInterviewModal(null);
                  setInterviewForm({ date: "", time: "", message: "" });
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkInterviewCalled}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Mark Interview Called
              </button>
            </div>
          </div>
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
          {applicants.map((applicant) => {
            const statusInfo = getStatusInfo(applicant.status);
            const isExpanded = expandedDetails[applicant.applicationId];

            return (
              <div key={applicant.applicationId} className="rounded-2xl hover:shadow-md transition-shadow bg-white border border-gray-200">
                <div className="py-6 px-4 sm:px-6">
                  <div className="flex flex-col gap-4">
                    {/* Header Row: Avatar, Name, Status */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-gray-600">
                          {applicant.user.fullName ? applicant.user.fullName.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {applicant.user.fullName || 'Anonymous User'}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>

                        {/* Primary Info: Phone, Location, Availability, Experience */}
                        <div className="space-y-2 text-sm">
                          {applicant.user.phone && (
                            <div className="font-semibold text-gray-900">
                              Phone: {applicant.user.phone}
                            </div>
                          )}
                          <div className="flex flex-wrap items-center gap-4 text-gray-700">
                            {applicant.user.location && (
                              <div className="font-semibold">
                                Location: {applicant.user.location}
                              </div>
                            )}
                            {applicant.user.availability && (
                              <div className="text-green-600 font-medium">
                                {getAvailabilityText(applicant.user.availability)}
                              </div>
                            )}
                            {applicant.user.experienceYears && (
                              <div>
                                Experience: {applicant.user.experienceYears} years
                              </div>
                            )}
                          </div>
                        </div>

                        {/* More Details Toggle */}
                        <button
                          onClick={() => toggleDetails(applicant.applicationId)}
                          className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        >
                          {isExpanded ? (
                            <>
                              <span>Less details</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </>
                          ) : (
                            <>
                              <span>More details</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </>
                          )}
                        </button>

                        {/* Expanded Details Section */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                            {applicant.user.email && (
                              <div className="text-sm text-gray-700">
                                <strong>Email:</strong> {applicant.user.email}
                              </div>
                            )}
                            {applicant.user.highestEducation && (
                              <div className="text-sm text-gray-700">
                                <strong>Education:</strong> {applicant.user.highestEducation}
                              </div>
                            )}
                            {applicant.coverLetter && (
                              <div className="text-sm text-gray-700">
                                <strong>Cover Letter:</strong>
                                <p className="mt-1 bg-gray-50 p-3 rounded-lg">{applicant.coverLetter}</p>
                              </div>
                            )}
                            {applicant.user.linkedinUrl && (
                              <div>
                                <a
                                  href={applicant.user.linkedinUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  LinkedIn Profile
                                </a>
                              </div>
                            )}
                            {applicant.resumePath && (
                              <button
                                onClick={() => downloadResume(applicant.resumePath, applicant.user.fullName || 'applicant')}
                                className="text-sm text-gray-600 hover:text-gray-800 underline"
                              >
                                Download Resume
                              </button>
                            )}
                          </div>
                        )}

                        <p className="text-xs text-gray-500 mt-3">
                          Applied on {formatDate(applicant.appliedAt)}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                      {/* Primary Actions: Call Now and WhatsApp */}
                      <div className="flex gap-3 flex-1">
                        {applicant.user.phone && (
                          <>
                            <button
                              onClick={() => handleCallNowClick(applicant)}
                              className="flex-1 sm:flex-none px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              Call Now
                            </button>
                            <button
                              onClick={() => handleWhatsApp(applicant)}
                              className="px-6 py-3 text-sm font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                              </svg>
                              WhatsApp
                            </button>
                          </>
                        )}
                      </div>

                      {/* Secondary Actions: Shortlist */}
                      {applicant.status === 'applied' && (
                        <button
                          onClick={() => handleShortlist(applicant.applicationId)}
                          className="px-4 py-3 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors"
                        >
                          Shortlist
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}