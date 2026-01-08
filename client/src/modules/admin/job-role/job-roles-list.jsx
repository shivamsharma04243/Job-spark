import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../components/apiconfig/apiconfig";

export default function AdminJobRoles() {
    const [jobRoles, setJobRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [formData, setFormData] = useState({ name: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchJobRoles();
    }, []);

    const fetchJobRoles = async () => {
        try {
            const response = await api.get("/admin/auth/job-roles");
            setJobRoles(response.data.jobRoles || []);
        } catch (error) {
            console.error("Error fetching job roles:", error);
            setError("Failed to fetch job roles");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate("/admin");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!formData.name || formData.name.trim().length === 0) {
            setError("Job role name is required");
            return;
        }

        if (formData.name.length > 150) {
            setError("Job role name must be 150 characters or less");
            return;
        }

        try {
            if (editingRole) {
                // Update existing role
                await api.put(`/admin/auth/job-roles/${editingRole.id}`, {
                    name: formData.name.trim()
                });
                setSuccess("Job role updated successfully");
            } else {
                // Create new role
                await api.post("/admin/auth/job-roles", {
                    name: formData.name.trim()
                });
                setSuccess("Job role created successfully");
            }

            // Reset form and refresh list
            setFormData({ name: "" });
            setEditingRole(null);
            setShowForm(false);
            fetchJobRoles();

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(""), 3000);
        } catch (error) {
            console.error("Error saving job role:", error);
            setError(
                error.response?.data?.error ||
                "Failed to save job role. Please try again."
            );
        }
    };

    const handleEdit = (role) => {
        setEditingRole(role);
        setFormData({ name: role.name });
        setShowForm(true);
        setError("");
        setSuccess("");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this job role?")) {
            return;
        }

        try {
            await api.delete(`/admin/auth/job-roles/${id}`);
            setSuccess("Job role deleted successfully");
            fetchJobRoles();
            setTimeout(() => setSuccess(""), 3000);
        } catch (error) {
            console.error("Error deleting job role:", error);
            setError(
                error.response?.data?.error ||
                "Failed to delete job role. Please try again."
            );
        }
    };

    const handleCancel = () => {
        setFormData({ name: "" });
        setEditingRole(null);
        setShowForm(false);
        setError("");
        setSuccess("");
    };

    if (loading) {
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
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <button
                            onClick={handleBack}
                            className="flex items-center text-primary-600 hover:text-primary-700 mb-2"
                        >
                            ← Back to Dashboard
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Manage Job Roles</h1>
                        <p className="text-gray-600">Total {jobRoles.length} job roles</p>
                    </div>
                    <div className="flex gap-2">
                        {!showForm && (
                            <button
                                onClick={() => {
                                    setShowForm(true);
                                    setEditingRole(null);
                                    setFormData({ name: "" });
                                    setError("");
                                    setSuccess("");
                                }}
                                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                            >
                                + Add New Role
                            </button>
                        )}
                        <button
                            onClick={fetchJobRoles}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Form Modal */}
                {showForm && (
                    <div className="mb-6 bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            {editingRole ? "Edit Job Role" : "Add New Job Role"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Job Role Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="e.g., Software Engineer, Data Analyst"
                                    maxLength={150}
                                    required
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    {formData.name.length}/150 characters
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                                >
                                    {editingRole ? "Update" : "Create"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Job Roles Table */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Job Role Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {jobRoles.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center">
                                            <div className="text-gray-500">
                                                <p className="text-lg font-medium mb-2">No job roles found</p>
                                                <p className="text-sm">Click "Add New Role" to create one</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    jobRoles.map((role) => (
                                        <tr key={role.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {role.id}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {role.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(role)}
                                                        className="text-primary-600 hover:text-primary-900 px-3 py-1 rounded border border-primary-200 hover:bg-primary-50"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(role.id)}
                                                        className="text-red-600 hover:text-red-900 px-3 py-1 rounded border border-red-200 hover:bg-red-50"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

