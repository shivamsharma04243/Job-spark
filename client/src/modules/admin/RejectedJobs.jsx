import { useState, useEffect } from "react";
import api from "../../components/apiconfig/apiconfig";

export default function RejectedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get("/admin/auth/jobs?status=rejected");
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Error fetching rejected jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const updateJobStatus = async (jobId, newStatus) => {
    try {
      await api.put(`/admin/auth/jobs/${jobId}/status`, {
        status: newStatus
      });
      
      // Remove from list immediately
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      
      // Refresh data
      fetchJobs();
    } catch (error) {
      console.error("Error updating job status:", error);
      alert("Failed to update job status. Please try again.");
    }
  };

  const formatExperience = (min, max) => {
    if (min == null && max == null) return "Fresher";
    if (min != null && max == null) return `${min}+ yrs`;
    if (min == null && max != null) return `Up to ${max} yrs`;
    return `${min}-${max} yrs`;
  };

  const formatSalary = (salary) => {
    if (!salary) return "Not specified";
    return salary;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Rejected Jobs</h1>
          <p className="text-sm md:text-base text-gray-600">
            Total {jobs.length} rejected jobs
          </p>
        </div>
        <button
          onClick={fetchJobs}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
        >
          Refresh
        </button>
      </div>

      {/* Rejected Jobs Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-4 py-3 bg-red-600 border-b border-red-700">
          <h2 className="text-lg font-semibold text-white">
            Rejected Jobs ({jobs.length})
          </h2>
          <p className="text-sm text-red-100">
            Jobs that have been rejected by admin
          </p>
        </div>
        {jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Details
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Company & Recruiter
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Location
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rejected Date
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-red-50">
                    <td className="px-3 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                          {job.title}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {job.job_type} • {formatExperience(job.min_experience, job.max_experience)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Salary: {formatSalary(job.salary)}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 hidden md:table-cell">
                      <div className="text-sm text-gray-900 truncate max-w-[150px]">{job.company}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[150px]">{job.recruiter_email}</div>
                    </td>
                    <td className="px-3 py-4 hidden lg:table-cell">
                      <div className="text-sm text-gray-900 truncate max-w-[120px]">{job.location}</div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(job.updated_at || job.created_at)}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm font-medium">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleViewDetails(job)}
                          className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm px-2 py-1 rounded border border-blue-200 hover:bg-blue-50"
                        >
                          View
                        </button>
                        <button
                          onClick={() => updateJobStatus(job.id, 'approved')}
                          className="text-green-600 hover:text-green-900 border border-green-200 hover:bg-green-50 text-xs sm:text-sm px-2 py-1 rounded"
                        >
                          Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Rejected Jobs</h3>
            <p className="text-gray-500">No jobs have been rejected yet</p>
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {showModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">Job Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-3">Job Information</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Job Title</label>
                      <p className="text-gray-900 text-sm md:text-base">{selectedJob.title}</p>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Job Type</label>
                      <p className="text-gray-900 text-sm md:text-base capitalize">{selectedJob.job_type}</p>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Vacancies</label>
                      <p className="text-gray-900 text-sm md:text-base">{selectedJob.vacancies || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Experience Required</label>
                      <p className="text-gray-900 text-sm md:text-base">
                        {formatExperience(selectedJob.min_experience, selectedJob.max_experience)}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Salary</label>
                      <p className="text-gray-900 text-sm md:text-base">{formatSalary(selectedJob.salary)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-3">Company & Location</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Company</label>
                      <p className="text-gray-900 text-sm md:text-base">{selectedJob.company}</p>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Location</label>
                      <p className="text-gray-900 text-sm md:text-base">{selectedJob.location}</p>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Posted By</label>
                      <p className="text-gray-900 text-sm md:text-base">{selectedJob.recruiter_email}</p>
                      {selectedJob.company_name && (
                        <p className="text-sm text-gray-600">({selectedJob.company_name})</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Status</label>
                      <p className="text-gray-900">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          Rejected
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-base md:text-lg font-semibold mb-3">Job Description</h3>
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <p className="text-gray-900 text-sm md:text-base whitespace-pre-line">
                    {selectedJob.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Contact Email</label>
                      <p className="text-gray-900 text-sm md:text-base">
                        {selectedJob.contact_email ? (
                          <a href={`mailto:${selectedJob.contact_email}`} className="text-blue-600 hover:underline">
                            {selectedJob.contact_email}
                          </a>
                        ) : 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Contact Phone</label>
                      <p className="text-gray-900 text-sm md:text-base">
                        {selectedJob.contact_phone ? (
                          <a href={`tel:${selectedJob.contact_phone}`} className="text-blue-600 hover:underline">
                            {selectedJob.contact_phone}
                          </a>
                        ) : 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-3">Interview Address</h3>
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                    <p className="text-gray-900 text-sm md:text-base whitespace-pre-line">
                      {selectedJob.interview_address || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => {
                    updateJobStatus(selectedJob.id, 'approved');
                    setShowModal(false);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm md:text-base"
                >
                  Approve Job
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm md:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}