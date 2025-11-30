import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/apiconfig/apiconfig";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);
// Fetch jobs from API
  const fetchJobs = async () => {
    try {
      const response = await api.get("/admin/auth/jobs");
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };
// Navigate back to dashboard
  const handleBack = () => {
    navigate("/admin-dashboard");
  };

  const formatSalary = (salary) => {
    if (!salary) return "Not specified";
    return salary;
  };
// Format experience range
  const formatExperience = (min, max) => {
    if (min == null && max == null) return "Fresher";
    if (min != null && max == null) return `${min}+ yrs`;
    if (min == null && max != null) return `Up to ${max} yrs`;
    return `${min}-${max} yrs`;
  };
// Filter jobs based on selected filter
  const filteredJobs = jobs.filter(job => {
    if (filter === "all") return true;
    if (filter === "full-time") return job.job_type?.toLowerCase().includes("full");
    if (filter === "part-time") return job.job_type?.toLowerCase().includes("part");
    if (filter === "contract") return job.job_type?.toLowerCase().includes("contract");
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
// Main render
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <button
              onClick={handleBack}
              className="flex items-center text-blue-600 hover:text-blue-700 mb-2"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Manage Jobs</h1>
            <p className="text-gray-600">Total {jobs.length} jobs posted</p>
          </div>
          <button
            onClick={fetchJobs}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === "all" 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              All Jobs
            </button>
            <button
              onClick={() => setFilter("full-time")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === "full-time" 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Full-time
            </button>
            <button
              onClick={() => setFilter("part-time")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === "part-time" 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Part-time
            </button>
            <button
              onClick={() => setFilter("contract")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === "contract" 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Contract
            </button>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company & Recruiter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience & Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {job.title}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {job.job_type}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Vacancies: {job.vacancies || 'Not specified'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {job.company}
                        </div>
                        <div className="text-sm text-gray-500">
                          {job.recruiter_email}
                        </div>
                        {job.company_name && (
                          <div className="text-xs text-gray-400">
                            by {job.company_name}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {job.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatExperience(job.min_experience, job.max_experience)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatSalary(job.salary)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(job.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(job)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No jobs found</p>
            </div>
          )}
        </div>
      </div>

      {/* Job Details Modal */}
      {showModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Job Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Job Information</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Job Title</label>
                      <p className="text-gray-900">{selectedJob.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Job Type</label>
                      <p className="text-gray-900 capitalize">{selectedJob.job_type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Vacancies</label>
                      <p className="text-gray-900">{selectedJob.vacancies || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Experience Required</label>
                      <p className="text-gray-900">
                        {formatExperience(selectedJob.min_experience, selectedJob.max_experience)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Salary</label>
                      <p className="text-gray-900">{formatSalary(selectedJob.salary)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Company & Location</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Company</label>
                      <p className="text-gray-900">{selectedJob.company}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Location</label>
                      <p className="text-gray-900">{selectedJob.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Posted By</label>
                      <p className="text-gray-900">{selectedJob.recruiter_email}</p>
                      {selectedJob.company_name && (
                        <p className="text-sm text-gray-600">({selectedJob.company_name})</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Posted Date</label>
                      <p className="text-gray-900">
                        {new Date(selectedJob.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-line">
                    {selectedJob.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact Email</label>
                      <p className="text-gray-900">
                        {selectedJob.contact_email ? (
                          <a href={`mailto:${selectedJob.contact_email}`} className="text-blue-600 hover:underline">
                            {selectedJob.contact_email}
                          </a>
                        ) : 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contact Phone</label>
                      <p className="text-gray-900">
                        {selectedJob.contact_phone ? (
                          <a href={`tel:${selectedJob.contact_phone}`} className="text-blue-600 hover:underline">
                            {selectedJob.contact_phone}
                          </a>
                        ) : 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Interview Address */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Interview Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-900 whitespace-pre-line">
                      {selectedJob.interview_address || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
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