import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../components/apiconfig/apiconfig";
import { 
  FileText, 
  Briefcase, 
  User, 
  Users, 
  BarChart3,
  Calendar,
  TrendingUp
} from "lucide-react";

export default function ApplicationsMonitoring() {
  const [activeTab, setActiveTab] = useState("all");
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statsPeriod, setStatsPeriod] = useState("monthly");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedRecruiterId, setSelectedRecruiterId] = useState("");
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [jobs, setJobs] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    if (activeTab === "job" || activeTab === "recruiter" || activeTab === "candidate") {
      fetchFilterOptions();
    }
  }, [activeTab, statsPeriod, selectedJobId, selectedRecruiterId, selectedCandidateId]);

  const fetchFilterOptions = async () => {
    try {
      if (activeTab === "job") {
        const response = await api.get("/admin/auth/jobs");
        setJobs(response.data.jobs || []);
      } else if (activeTab === "recruiter") {
        const response = await api.get("/admin/auth/recruiters");
        setRecruiters(response.data.recruiters || []);
      } else if (activeTab === "candidate") {
        const response = await api.get("/admin/auth/users");
        setCandidates(response.data.users || []);
      }
    } catch (error) {
      console.error("Error fetching filter options:", error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === "stats") {
        const response = await api.get(`/admin/auth/applications/stats?period=${statsPeriod}`);
        setStats(response.data);
      } else if (activeTab === "job" && selectedJobId) {
        const response = await api.get(`/admin/auth/applications/job/${selectedJobId}`);
        setApplications(response.data.applications || []);
      } else if (activeTab === "recruiter" && selectedRecruiterId) {
        const response = await api.get(`/admin/auth/applications/recruiter/${selectedRecruiterId}`);
        setApplications(response.data.applications || []);
      } else if (activeTab === "candidate" && selectedCandidateId) {
        const response = await api.get(`/admin/auth/applications/candidate/${selectedCandidateId}`);
        setApplications(response.data.applications || []);
      } else {
        const response = await api.get("/admin/auth/applications");
        setApplications(response.data.applications || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const handleBack = () => {
    navigate("/admin");
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSelectedJobId("");
    setSelectedRecruiterId("");
    setSelectedCandidateId("");
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: "bg-blue-100 text-blue-800",
      shortlisted: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
      hired: "bg-green-100 text-green-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const filteredApplications = () => {
    return applications;
  };

  const tabs = [
    { id: "all", label: "All Applications", icon: <FileText size={18} /> },
    { id: "job", label: "Job-wise", icon: <Briefcase size={18} /> },
    { id: "recruiter", label: "Recruiter-wise", icon: <Users size={18} /> },
    { id: "candidate", label: "Candidate-wise", icon: <User size={18} /> },
    { id: "stats", label: "Statistics", icon: <BarChart3 size={18} /> },
  ];

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Applications Monitoring</h1>
          <p className="text-gray-600">Monitor and analyze all job applications</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-primary-600 border-b-2 border-primary-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Section for Job/Recruiter/Candidate views */}
        {(activeTab === "job" || activeTab === "recruiter" || activeTab === "candidate") && (
          <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">
                {activeTab === "job" && "Select Job:"}
                {activeTab === "recruiter" && "Select Recruiter:"}
                {activeTab === "candidate" && "Select Candidate:"}
              </label>
              {activeTab === "job" && (
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Jobs</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} - {job.company}
                    </option>
                  ))}
                </select>
              )}
              {activeTab === "recruiter" && (
                <select
                  value={selectedRecruiterId}
                  onChange={(e) => setSelectedRecruiterId(e.target.value)}
                  className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Recruiters</option>
                  {recruiters.map((recruiter) => (
                    <option key={recruiter.id} value={recruiter.id}>
                      {recruiter.name || recruiter.email}
                    </option>
                  ))}
                </select>
              )}
              {activeTab === "candidate" && (
                <select
                  value={selectedCandidateId}
                  onChange={(e) => setSelectedCandidateId(e.target.value)}
                  className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Candidates</option>
                  {candidates.map((candidate) => (
                    <option key={candidate.user_id || candidate.id} value={candidate.user_id || candidate.id}>
                      {candidate.full_name || candidate.name} - {candidate.email}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        {activeTab === "stats" ? (
          <StatsView stats={stats} period={statsPeriod} setPeriod={setStatsPeriod} />
        ) : (
          <ApplicationsListView 
            applications={filteredApplications()} 
            onViewDetails={handleViewDetails}
            getStatusColor={getStatusColor}
            loading={loading}
          />
        )}

        {/* Application Details Modal */}
        {showModal && selectedApplication && (
          <ApplicationDetailsModal
            application={selectedApplication}
            onClose={() => setShowModal(false)}
            getStatusColor={getStatusColor}
          />
        )}
      </div>
    </div>
  );
}

// Stats View Component
function StatsView({ stats, period, setPeriod }) {
  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Period Toggle */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Statistics Period</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setPeriod("daily")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                period === "daily"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setPeriod("monthly")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                period === "monthly"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      {/* Overall Totals */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard
          title="Total Applications"
          value={stats.totals?.total || 0}
          icon={<FileText />}
          color="blue"
        />
        <StatCard
          title="Applied"
          value={stats.totals?.applied || 0}
          icon={<Calendar />}
          color="blue"
        />
        <StatCard
          title="Shortlisted"
          value={stats.totals?.shortlisted || 0}
          icon={<TrendingUp />}
          color="yellow"
        />
        <StatCard
          title="Rejected"
          value={stats.totals?.rejected || 0}
          icon={<FileText />}
          color="red"
        />
        <StatCard
          title="Hired"
          value={stats.totals?.hired || 0}
          icon={<TrendingUp />}
          color="green"
        />
      </div>

      {/* Time Series Chart */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">
          {period === "daily" ? "Daily" : "Monthly"} Application Trends
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Applied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Shortlisted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rejected
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Hired
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.stats?.map((stat, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {stat.period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stat.total_applications}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stat.applied_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stat.shortlisted_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stat.rejected_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stat.hired_count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Applications List View Component
function ApplicationsListView({ applications, onViewDetails, getStatusColor, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Application ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Job Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Candidate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Recruiter
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Applied Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((app) => (
              <tr key={app.application_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #{app.application_id}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {app.job_title}
                  </div>
                  <div className="text-sm text-gray-500">{app.company}</div>
                  <div className="text-xs text-gray-400">{app.job_location}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {app.candidate_name}
                  </div>
                  <div className="text-sm text-gray-500">{app.candidate_email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {app.recruiter_name}
                  </div>
                  <div className="text-sm text-gray-500">{app.recruiter_email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(app.applied_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onViewDetails(app)}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {applications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No applications found</p>
        </div>
      )}
    </div>
  );
}

// Application Details Modal
function ApplicationDetailsModal({ application, onClose, getStatusColor }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
            <button
              onClick={onClose}
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
                  <p className="text-gray-900">{application.job_title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Company</label>
                  <p className="text-gray-900">{application.company}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="text-gray-900">{application.job_location}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Candidate Information</h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900">{application.candidate_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{application.candidate_email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      application.status
                    )}`}
                  >
                    {application.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {application.cover_letter && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Cover Letter</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900 whitespace-pre-line">
                  {application.cover_letter}
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

