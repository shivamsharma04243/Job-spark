import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/apiconfig/apiconfig";

export default function AdminRecruiters() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      const response = await api.get("/admin/auth/recruiters");
      setRecruiters(response.data.recruiters || []);
    } catch (error) {
      console.error("Error fetching recruiters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (recruiter) => {
    setSelectedRecruiter(recruiter);
    setShowModal(true);
  };

  const handleBack = () => {
    navigate("/admin-dashboard");
  };

  const toggleVerification = async (recruiterId, currentStatus) => {
    try {
      // You'll need to create this API endpoint
      await api.put(`/admin/auth/recruiters/${recruiterId}/verify`, {
        verified: !currentStatus
      });
      fetchRecruiters(); // Refresh data
    } catch (error) {
      console.error("Error updating verification:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Manage Recruiters</h1>
            <p className="text-gray-600">
              Total {recruiters.length} recruiters • {recruiters.filter(r => r.verified).length} verified
            </p>
          </div>
          <button
            onClick={fetchRecruiters}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {/* Recruiters Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recruiters.map((recruiter) => (
                  <tr key={recruiter.user_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {recruiter.company_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {recruiter.company_website && (
                            <a 
                              href={recruiter.company_website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {recruiter.company_website}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{recruiter.email}</div>
                      <div className="text-sm text-gray-500">@{recruiter.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {recruiter.company_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {recruiter.city}, {recruiter.state}
                      </div>
                      <div className="text-sm text-gray-500">{recruiter.country}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        recruiter.verified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {recruiter.verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewDetails(recruiter)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => toggleVerification(recruiter.user_id, recruiter.verified)}
                        className={`${
                          recruiter.verified 
                            ? 'text-orange-600 hover:text-orange-900' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {recruiter.verified ? 'Unverify' : 'Verify'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {recruiters.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No recruiters found</p>
            </div>
          )}
        </div>
      </div>

      {/* Recruiter Details Modal - Similar structure to Users modal */}
      {showModal && selectedRecruiter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Recruiter Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Company Information</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Company Name</label>
                      <p className="text-gray-900">{selectedRecruiter.company_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Website</label>
                      <p className="text-gray-900">
                        {selectedRecruiter.company_website ? (
                          <a href={selectedRecruiter.company_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {selectedRecruiter.company_website}
                          </a>
                        ) : 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Company Type</label>
                      <p className="text-gray-900 capitalize">{selectedRecruiter.company_type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Verification Status</label>
                      <p className="text-gray-900">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedRecruiter.verified 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedRecruiter.verified ? 'Verified' : 'Pending Verification'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedRecruiter.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Username</label>
                      <p className="text-gray-900">@{selectedRecruiter.username}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Member Since</label>
                      <p className="text-gray-900">
                        {new Date(selectedRecruiter.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Address</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900">{selectedRecruiter.address_line1}</p>
                  {selectedRecruiter.address_line2 && (
                    <p className="text-gray-900">{selectedRecruiter.address_line2}</p>
                  )}
                  <p className="text-gray-900">
                    {[selectedRecruiter.city, selectedRecruiter.state, selectedRecruiter.country, selectedRecruiter.pincode]
                      .filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>

              {selectedRecruiter.verification_notes && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Verification Notes</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-gray-900">{selectedRecruiter.verification_notes}</p>
                  </div>
                </div>
              )}

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