import React, { useEffect, useState } from "react";
import api from "../../../components/apiconfig/apiconfig";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // form state
  const [form, setForm] = useState({
    user_id: "",
    full_name: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    experience_years: "",
    highest_education: "",
    resume_path: "",
    linkedin_url: "",
    portfolio_url: "",
  });

  const [selectedResumeFile, setSelectedResumeFile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/profile/user");
      if (res?.data?.success && res.data.user) {
        setUser(res.data.user);
        setForm(mapUserToForm(res.data.user));
      }
    } catch (err) {
      console.warn("Could not load profile:", err?.response?.status || err.message);
    } finally {
      try {
        const auth = await api.get('/auth/authcheck');
        const authUser = auth?.data?.user;
        if (authUser) {
          setForm((s) => (s.user_id ? s : { ...s, user_id: authUser.id || authUser.sub || s.user_id }));
        }
      } catch (ignore) {}
      setLoading(false);
    }
  }

  function mapUserToForm(u) {
    return {
      user_id: u.user_id || u.id || "",
      full_name: u.full_name || "",
      phone: u.phone || "",
      city: u.city || "",
      state: u.state || "",
      country: u.country || "",
      experience_years: u.experience_years ?? "",
      highest_education: u.highest_education || "",
      resume_path: u.resume_path || "",
      linkedin_url: u.linkedin_url || "",
      portfolio_url: u.portfolio_url || "",
    };
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0] || null;
    setSelectedResumeFile(file);
    setForm((s) => ({ ...s, resume_path: file ? file.name : s.resume_path }));
  }

  async function uploadResume(file) {
    return file ? file.name : null;
  }

  async function handleSave(e) {
    e?.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let payloadUserId = form.user_id;
      if (!payloadUserId) {
        try {
          const auth = await api.get('/auth/authcheck');
          const authUser = auth?.data?.user;
          if (authUser) {
            payloadUserId = authUser.id || authUser.sub || payloadUserId;
            setForm((s) => ({ ...s, user_id: payloadUserId }));
          } else {
            setError('Cannot save profile: missing user session. Please sign in again.');
            setSaving(false);
            return;
          }
        } catch (err) {
          setError('Cannot save profile: missing user session. Please sign in again.');
          setSaving(false);
          return;
        }
      }
      
      let resumePathToSend = form.resume_path;
      if (selectedResumeFile) {
        resumePathToSend = await uploadResume(selectedResumeFile);
      }

      const payload = {
        user_id: payloadUserId || undefined,
        full_name: form.full_name,
        phone: form.phone,
        city: form.city || null,
        state: form.state || null,
        country: form.country || null,
        experience_years: form.experience_years ? Number(form.experience_years) : 0,
        highest_education: form.highest_education || null,
        resume_path: resumePathToSend || null,
        linkedin_url: form.linkedin_url || null,
        portfolio_url: form.portfolio_url || null,
      };

      const res = await api.put("/profile/user", payload);

      if (res?.data?.success) {
        setUser(res.data.user || payload);
        setForm(mapUserToForm(res.data.user || payload));
        setIsEditing(false);
        setSelectedResumeFile(null);
      } else {
        setError(res?.data?.message || "Unknown server response");
      }
    } catch (err) {
      console.error("Save profile error:", err);
      setError(err?.response?.data?.message || err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  function handleEditClick() {
    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
    if (user) setForm(mapUserToForm(user));
    setSelectedResumeFile(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Professional Profile</h1>
          <p className="text-gray-600 text-lg">Manage your professional information and career details</p>
        </div>

        {loading ? (
          <Card className="rounded-2xl border border-blue-200 shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4 text-lg">Loading your profile...</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="rounded-2xl border border-blue-200 shadow-lg sticky top-8">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg">
                      {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <h2 className="font-bold text-xl text-gray-900">{user?.full_name || "New User"}</h2>
                    <p className="text-gray-600 mt-2">{user?.highest_education || "Add your education"}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {user?.experience_years ?? 0} years experience
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {user?.phone || "No phone"}
                    </div>

                    {user?.resume_path && (
                      <div className="pt-4 border-t border-blue-200">
                        <a href={user.resume_path} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          View Resume
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card className="rounded-2xl border border-blue-200 shadow-lg overflow-hidden">
                {/* Card Header */}
                <div className="px-8 py-6 border-b border-blue-200 bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
                      <p className="text-gray-600 mt-1">Update your professional details and contact information</p>
                    </div>
                    {!isEditing && (
                      <Button
                        onClick={handleEditClick}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <CardContent className="p-8">
                  {!isEditing ? (
                    <ProfileView user={user} onEdit={handleEditClick} />
                  ) : (
                    <form onSubmit={handleSave} className="space-y-8">
                      {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                          {error}
                        </div>
                      )}

                      {/* Personal Information Section */}
                      <Section title="Personal Information">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Full Name *</label>
                            <Input 
                              name="full_name" 
                              value={form.full_name} 
                              onChange={handleChange} 
                              required
                              placeholder="Enter your full name"
                              className="border-blue-300 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Phone *</label>
                            <Input 
                              name="phone" 
                              value={form.phone} 
                              onChange={handleChange} 
                              required
                              placeholder="Enter your phone number"
                              className="border-blue-300 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Highest Education</label>
                            <Input 
                              name="highest_education" 
                              value={form.highest_education} 
                              onChange={handleChange}
                              placeholder="e.g., Bachelor's Degree"
                              className="border-blue-300 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Experience (years)</label>
                            <Input 
                              name="experience_years" 
                              value={form.experience_years} 
                              onChange={handleChange} 
                              type="number" 
                              min="0"
                              placeholder="Years of experience"
                              className="border-blue-300 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </Section>

                      {/* Location Information Section */}
                      <Section title="Location Information">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">City</label>
                            <Input 
                              name="city" 
                              value={form.city} 
                              onChange={handleChange}
                              placeholder="Enter your city"
                              className="border-blue-300 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">State</label>
                            <Input 
                              name="state" 
                              value={form.state} 
                              onChange={handleChange}
                              placeholder="Enter your state"
                              className="border-blue-300 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Country</label>
                            <Input 
                              name="country" 
                              value={form.country} 
                              onChange={handleChange}
                              placeholder="Enter your country"
                              className="border-blue-300 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </Section>

                      {/* Professional Links Section */}
                      <Section title="Professional Links">
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">LinkedIn URL</label>
                            <Input 
                              name="linkedin_url" 
                              value={form.linkedin_url} 
                              onChange={handleChange} 
                              placeholder="https://linkedin.com/in/yourprofile"
                              type="url"
                              className="border-blue-300 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">Portfolio URL</label>
                            <Input 
                              name="portfolio_url" 
                              value={form.portfolio_url} 
                              onChange={handleChange} 
                              placeholder="https://yourportfolio.com"
                              type="url"
                              className="border-blue-300 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </Section>

                      {/* Resume Section */}
                      <Section title="Resume Upload">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-6 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-400 transition-colors bg-blue-50">
                            <div className="flex items-center">
                              <svg className="w-10 h-10 text-blue-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <div>
                                <p className="text-lg font-semibold text-gray-900">
                                  {selectedResumeFile ? selectedResumeFile.name : (form.resume_path || 'No resume uploaded')}
                                </p>
                                <p className="text-sm text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                              </div>
                            </div>
                            <label className="cursor-pointer">
                              <span className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                                Choose File
                              </span>
                              <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileSelect} className="hidden" />
                            </label>
                          </div>
                        </div>
                      </Section>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-4 pt-8 border-t border-blue-200">
                        <Button
                          type="button"
                          onClick={handleCancel}
                          variant="outline"
                          className="border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-3 font-semibold"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={saving}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-semibold flex items-center"
                        >
                          {saving ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Saving...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileView({ user, onEdit }) {
  if (!user) {
    return (
      <div className="text-center py-12">
        <svg className="w-20 h-20 text-blue-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Profile Found</h3>
        <p className="text-gray-600 text-lg mb-8">Create your professional profile to get started with your job search</p>
        <Button 
          onClick={onEdit} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold"
        >
          Create Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <InfoSection title="Personal Information" icon="user">
        <InfoGrid>
          <InfoItem label="Full Name" value={user.full_name} />
          <InfoItem label="Phone" value={user.phone} />
          <InfoItem label="Education" value={user.highest_education} />
          <InfoItem label="Experience" value={user.experience_years ? `${user.experience_years} years` : null} />
        </InfoGrid>
      </InfoSection>

      {/* Location */}
      <InfoSection title="Location Information" icon="location">
        <InfoGrid>
          <InfoItem label="City" value={user.city} />
          <InfoItem label="State" value={user.state} />
          <InfoItem label="Country" value={user.country} />
        </InfoGrid>
      </InfoSection>

      {/* Professional Links */}
      <InfoSection title="Professional Links" icon="link">
        <div className="space-y-4">
          <LinkItem 
            label="LinkedIn" 
            url={user.linkedin_url} 
            icon="linkedin" 
          />
          <LinkItem 
            label="Portfolio" 
            url={user.portfolio_url} 
            icon="portfolio" 
          />
        </div>
      </InfoSection>
    </div>
  );
}

// Section Component for form grouping
function Section({ title, children }) {
  return (
    <div>
      <h4 className="text-xl font-bold text-gray-900 mb-6">{title}</h4>
      {children}
    </div>
  );
}

// Info Section Component for view mode
function InfoSection({ title, icon, children }) {
  const getIcon = (iconName) => {
    const icons = {
      user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      location: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
      link: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
    };
    return icons[icon] || icons.user;
  };

  return (
    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
      <div className="flex items-center mb-6">
        <svg className="w-6 h-6 text-blue-600 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIcon(icon)} />
        </svg>
        <h4 className="text-xl font-bold text-gray-900">{title}</h4>
      </div>
      {children}
    </div>
  );
}

// Info Grid Component
function InfoGrid({ children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  );
}

// Info Item Component
function InfoItem({ label, value }) {
  return (
    <div>
      <dt className="text-sm font-semibold text-gray-700 mb-2">{label}</dt>
      <dd className="text-lg text-gray-900 font-medium">{value || "—"}</dd>
    </div>
  );
}

// Link Item Component
function LinkItem({ label, url, icon }) {
  const getIcon = (iconName) => {
    const icons = {
      linkedin: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M6 4a2 2 0 100-4 2 2 0 000 4z",
      portfolio: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    };
    return icons[icon] || icons.portfolio;
  };

  if (!url) {
    return (
      <div className="flex items-center text-gray-500">
        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIcon(icon)} />
        </svg>
        <span className="font-medium">{label}:</span>
        <span className="ml-3 text-gray-400">Not provided</span>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIcon(icon)} />
      </svg>
      <span className="font-medium text-gray-700 mr-3">{label}:</span>
      <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-700 font-medium truncate">
        {url}
      </a>
    </div>
  );
}