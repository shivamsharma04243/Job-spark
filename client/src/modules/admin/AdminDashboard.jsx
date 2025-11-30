import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/apiconfig/apiconfig";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecruiters: 0,
    totalJobs: 0,
    verifiedRecruiters: 0
  });
  const [recentData, setRecentData] = useState({
    recentUsers: [],
    recentRecruiters: [],
    recentJobs: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [usersRes, recruitersRes, jobsRes] = await Promise.all([
        api.get("/admin/auth/users"),
        api.get("/admin/auth/recruiters"), 
        api.get("/admin/auth/jobs")
      ]);

      const users = usersRes.data.users || [];
      const recruiters = recruitersRes.data.recruiters || [];
      const jobs = jobsRes.data.jobs || [];
// Update stats and recent data
      setStats({
        totalUsers: users.length,
        totalRecruiters: recruiters.length,
        totalJobs: jobs.length,
        verifiedRecruiters: recruiters.filter(r => r.verified).length
      });

      setRecentData({
        recentUsers: users.slice(0, 5),
        recentRecruiters: recruiters.slice(0, 5),
        recentJobs: jobs.slice(0, 5)
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };
// Logout handler
  const handleLogout = async () => {
    try {
      await api.post("/admin/auth/logout");
      window.location.href = "/admin/signin";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
// Navigation handler for viewing all items
  const handleViewAll = (type) => {
    navigate(`/admin/${type}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }
// Main dashboard layout
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <span className="ml-3 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchDashboardData}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Refresh Data
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users - Clickable */}
          <div 
            onClick={() => handleViewAll('users')}
            className="bg-white p-6 rounded-xl shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-blue-600 mt-1">Click to view all →</p>
              </div>
            </div>
          </div>

          {/* Total Jobs - Clickable */}
          <div 
            onClick={() => handleViewAll('jobs')}
            className="bg-white p-6 rounded-xl shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalJobs}</p>
                <p className="text-xs text-green-600 mt-1">Click to view all →</p>
              </div>
            </div>
          </div>

          {/* Recruiters - Clickable */}
          <div 
            onClick={() => handleViewAll('recruiters')}
            className="bg-white p-6 rounded-xl shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recruiters</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalRecruiters}</p>
                <p className="text-xs text-purple-600 mt-1">Click to view all →</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Verified Recruiters</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.verifiedRecruiters}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of the dashboard remains the same */}
        {/* ... */}
      </main>
    </div>
  );
}