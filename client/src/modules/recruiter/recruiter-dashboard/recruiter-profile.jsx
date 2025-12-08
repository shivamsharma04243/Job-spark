import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../components/apiconfig/apiconfig";

export default function RecruiterProfileView() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    company_website: "",
    company_type: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    country: "",
    pincode: ""
  });

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const res = await api.get("/profile/recruiter");
        if (!mounted) return;
        const profileData = res.data?.recruiter ?? null;
        setProfile(profileData);
        if (profileData) {
          setForm({
            company_name: profileData.company_name || "",
            company_website: profileData.company_website || "",
            company_type: profileData.company_type || "",
            address_line1: profileData.address_line1 || "",
            address_line2: profileData.address_line2 || "",
            city: profileData.city || "",
            state: profileData.state || "",
            country: profileData.country || "",
            pincode: profileData.pincode || ""
          });
        }
      } catch (err) {
        if (err.response) {
          if (err.response.status === 404) {
            setError("You don't have a recruiter profile yet.");
          } else if (err.response.status === 401) {
            setError("You must be logged in to view this page.");
          } else {
            console.error("Server error loading recruiter profile:", err.response.data || err);
            setError("Failed to load profile (server error).");
          }
        } else {
          console.error("Network error loading recruiter profile:", err);
          setError("Failed to load profile (network error).");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProfile();
    return () => { mounted = false; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/profile/recruiter", form);
      setProfile(res.data?.recruiter);
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile. Please try again.");
    }
  };

  const handleCancel = () => {
    if (profile) {
      setForm({
        company_name: profile.company_name || "",
        company_website: profile.company_website || "",
        company_type: profile.company_type || "",
        address_line1: profile.address_line1 || "",
        address_line2: profile.address_line2 || "",
        city: profile.city || "",
        state: profile.state || "",
        country: profile.country || "",
        pincode: profile.pincode || ""
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-gray-200 rounded-2xl h-64"></div>
            </div>
            <div className="lg:col-span-3">
              <div className="bg-gray-200 rounded-2xl h-96"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-800 mb-2">Unable to load profile</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Recruiter Profile</h1>
          <p className="text-gray-600 mt-2">Manage your company information and recruitment details</p>
        </div>
        {!isEditing && profile && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Company Overview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
            {/* Company Badge */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {form.company_name ? form.company_name.charAt(0).toUpperCase() : "C"}
              </div>
              <h2 className="font-bold text-lg text-gray-900 truncate">{form.company_name || "Your Company"}</h2>
              <p className="text-sm text-gray-600 mt-1">{form.company_type || "Company"}</p>
              
              {/* Verification Badge */}
              {profile && (
                <div className="mt-3">
                  {profile.verified === 1 ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Pending Verification
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Quick Links */}
            {form.company_website && (
              <div className="border-t pt-4">
                <a
                  href={form.company_website.startsWith('http') ? form.company_website : `https://${form.company_website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Visit Website
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">
                {isEditing ? "Edit Company Information" : "Company Information"}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {isEditing ? "Update your business details below" : "Complete business details and verification status"}
              </p>
            </div>

            {/* Card Body */}
            <div className="p-6">
              {isEditing ? (
                <form onSubmit={handleSave} className="space-y-6">
                  {/* Company Details Section */}
                  <InfoSection title="Company Details" icon="business">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name *
                        </label>
                        <input
                          name="company_name"
                          value={form.company_name}
                          onChange={handleChange}
                          required
                          placeholder="Enter company name"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Type
                        </label>
                        <input
                          name="company_type"
                          value={form.company_type}
                          onChange={handleChange}
                          placeholder="e.g., Technology, Healthcare"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Website
                        </label>
                        <input
                          name="company_website"
                          value={form.company_website}
                          onChange={handleChange}
                          placeholder="https://yourcompany.com"
                          type="url"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none"
                        />
                      </div>
                    </div>
                  </InfoSection>

                  {/* Address Section */}
                  <InfoSection title="Company Address" icon="location">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 1
                        </label>
                        <input
                          name="address_line1"
                          value={form.address_line1}
                          onChange={handleChange}
                          placeholder="Street address, P.O. box"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address Line 2
                        </label>
                        <input
                          name="address_line2"
                          value={form.address_line2}
                          onChange={handleChange}
                          placeholder="Apartment, suite, unit, building, floor, etc."
                          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          name="city"
                          value={form.city}
                          onChange={handleChange}
                          placeholder="City"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          name="state"
                          value={form.state}
                          onChange={handleChange}
                          placeholder="State / Province"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          name="country"
                          value={form.country}
                          onChange={handleChange}
                          placeholder="Country"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pincode
                        </label>
                        <input
                          name="pincode"
                          value={form.pincode}
                          onChange={handleChange}
                          placeholder="Postal code"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none"
                        />
                      </div>
                    </div>
                  </InfoSection>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Company Details Section */}
                  <InfoSection title="Company Details" icon="business">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoItem 
                        label="Company Name" 
                        value={profile?.company_name}
                        icon="building"
                      />
                      <InfoItem 
                        label="Company Type" 
                        value={profile?.company_type}
                        icon="category"
                      />
                      <InfoItem 
                        label="Website" 
                        value={profile?.company_website}
                        icon="link"
                        isLink={true}
                      />
                      <InfoItem 
                        label="Verification Status" 
                        value={profile?.verified === 1 ? "Verified" : "Pending Verification"}
                        icon="verified"
                        status={profile?.verified === 1 ? "success" : "warning"}
                      />
                    </div>
                  </InfoSection>

                  {/* Address Section */}
                  <InfoSection title="Company Address" icon="location">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InfoItem 
                        label="Address Line 1" 
                        value={profile?.address_line1}
                        icon="location"
                      />
                      <InfoItem 
                        label="Address Line 2" 
                        value={profile?.address_line2}
                        icon="location"
                      />
                      <InfoItem 
                        label="City" 
                        value={profile?.city}
                        icon="city"
                      />
                      <InfoItem 
                        label="State" 
                        value={profile?.state}
                        icon="region"
                      />
                      <InfoItem 
                        label="Country" 
                        value={profile?.country}
                        icon="country"
                      />
                      <InfoItem 
                        label="Pincode" 
                        value={profile?.pincode}
                        icon="pin"
                      />
                    </div>
                  </InfoSection>

                  {/* Verification & Metadata Section */}
                  {profile && (
                    <InfoSection title="Profile Information" icon="info">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoItem 
                          label="Verification Notes" 
                          value={profile.verification_notes || "No notes provided"}
                          icon="notes"
                        />
                        <InfoItem 
                          label="Profile Created" 
                          value={profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : "—"}
                          icon="calendar"
                        />
                        <InfoItem 
                          label="Last Updated" 
                          value={profile.updated_at ? new Date(profile.updated_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : "—"}
                          icon="update"
                        />
                      </div>
                    </InfoSection>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Info Section Component (keep as is)
function InfoSection({ title, icon, children }) {
  const getIcon = (iconName) => {
    const icons = {
      business: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      location: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
      info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    };
    return icons[icon] || icons.info;
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="flex items-center mb-4">
        <svg className="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIcon(icon)} />
        </svg>
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
      </div>
      {children}
    </div>
  );
}

// Info Item Component (keep as is)
function InfoItem({ label, value, icon, isLink = false, status }) {
  const getIcon = (iconName) => {
    const icons = {
      building: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      category: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      link: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
      verified: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      location: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
      city: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      region: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      country: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      pin: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
      notes: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
      calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      update: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    };
    return icons[icon] || icons.info;
  };

  const getStatusColor = (status) => {
    const colors = {
      success: "text-green-600 bg-green-100",
      warning: "text-yellow-600 bg-yellow-100",
      error: "text-red-600 bg-red-100"
    };
    return colors[status] || "text-gray-600 bg-gray-100";
  };

  return (
    <div>
      <dt className="flex items-center text-sm font-medium text-gray-600 mb-2">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIcon(icon)} />
        </svg>
        {label}
      </dt>
      <dd className="ml-6">
        {isLink && value && value !== "Not provided" ? (
          <a
            href={value.startsWith('http') ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm truncate block"
          >
            {value}
          </a>
        ) : status ? (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {value}
          </span>
        ) : (
          <span className="text-gray-900 font-medium text-sm">{value || "Not provided"}</span>
        )}
      </dd>
    </div>
  );
}