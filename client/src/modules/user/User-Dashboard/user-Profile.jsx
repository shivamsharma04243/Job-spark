import React, { useEffect, useState } from "react";
import api from "../../../components/apiconfig/apiconfig.jsx";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Card Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Profile Information</h3>
            <p className="text-sm text-slate-600 mt-1">Update your professional details and contact information</p>
          </div>
          {!isEditing && (
            <Button
              onClick={handleEditClick}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-sm"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <CardContent className="p-6">
        {!isEditing ? (
          <ProfileView user={user} onEdit={handleEditClick} />
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Personal Information */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-4">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Full Name *</label>
                  <Input 
                    name="full_name" 
                    value={form.full_name} 
                    onChange={handleChange} 
                    required
                    placeholder="Enter your full name"
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Phone *</label>
                  <Input 
                    name="phone" 
                    value={form.phone} 
                    onChange={handleChange} 
                    required
                    placeholder="Enter your phone number"
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Highest Education</label>
                  <Input 
                    name="highest_education" 
                    value={form.highest_education} 
                    onChange={handleChange}
                    placeholder="e.g., Bachelor's Degree"
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Experience (years)</label>
                  <Input 
                    name="experience_years" 
                    value={form.experience_years} 
                    onChange={handleChange} 
                    type="number" 
                    min="0"
                    placeholder="Years of experience"
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-4">Location Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">City</label>
                  <Input 
                    name="city" 
                    value={form.city} 
                    onChange={handleChange}
                    placeholder="Enter your city"
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">State</label>
                  <Input 
                    name="state" 
                    value={form.state} 
                    onChange={handleChange}
                    placeholder="Enter your state"
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Country</label>
                  <Input 
                    name="country" 
                    value={form.country} 
                    onChange={handleChange}
                    placeholder="Enter your country"
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Professional Links */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-4">Professional Links</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">LinkedIn URL</label>
                  <Input 
                    name="linkedin_url" 
                    value={form.linkedin_url} 
                    onChange={handleChange} 
                    placeholder="https://linkedin.com/in/yourprofile"
                    type="url"
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Portfolio URL</label>
                  <Input 
                    name="portfolio_url" 
                    value={form.portfolio_url} 
                    onChange={handleChange} 
                    placeholder="https://yourportfolio.com"
                    type="url"
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Resume Section */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-4">Resume Upload</h4>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 hover:border-slate-400 transition-colors bg-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {selectedResumeFile ? selectedResumeFile.name : (form.resume_path || 'No resume uploaded')}
                      </p>
                      <p className="text-xs text-slate-500">PDF, DOC, DOCX up to 10MB</p>
                    </div>
                  </div>
                  <label className="cursor-pointer">
                    <span className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium">
                      Choose File
                    </span>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileSelect} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-sm font-medium"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </div>
  );
}

function ProfileView({ user, onEdit }) {
  if (!user) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No Profile Found</h3>
        <p className="text-slate-600 text-sm mb-4">Create your professional profile to get started</p>
        <Button 
          onClick={onEdit} 
          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-sm"
        >
          Create Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
            {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 text-lg">{user.full_name}</h3>
            <p className="text-slate-600 text-sm">{user.highest_education || "Add education"}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="text-slate-700">{user.experience_years ?? 0} years experience</span>
              <span className="text-slate-700">{user.phone || "No phone"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Personal Information</h4>
          <div className="space-y-3">
            <InfoItem label="Full Name" value={user.full_name} />
            <InfoItem label="Phone" value={user.phone} />
            <InfoItem label="Education" value={user.highest_education} />
            <InfoItem label="Experience" value={user.experience_years ? `${user.experience_years} years` : null} />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Location Information</h4>
          <div className="space-y-3">
            <InfoItem label="City" value={user.city} />
            <InfoItem label="State" value={user.state} />
            <InfoItem label="Country" value={user.country} />
          </div>
        </div>
      </div>

      {/* Professional Links */}
      <div>
        <h4 className="text-sm font-semibold text-slate-900 mb-3">Professional Links</h4>
        <div className="space-y-3">
          <LinkItem 
            label="LinkedIn" 
            url={user.linkedin_url} 
          />
          <LinkItem 
            label="Portfolio" 
            url={user.portfolio_url} 
          />
        </div>
      </div>

      {/* Resume */}
      {user.resume_path && (
        <div className="border-t border-slate-200 pt-4">
          <a 
            href={user.resume_path} 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View Resume
          </a>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="text-sm font-medium text-slate-900">{value || "—"}</span>
    </div>
  );
}

function LinkItem({ label, url }) {
  if (!url) {
    return (
      <div className="flex items-center justify-between py-2 border-b border-slate-100">
        <span className="text-sm text-slate-600">{label}</span>
        <span className="text-sm text-slate-400">Not provided</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100">
      <span className="text-sm text-slate-600">{label}</span>
      <a 
        href={url} 
        target="_blank" 
        rel="noreferrer"
        className="text-sm text-blue-600 hover:text-blue-700 font-medium truncate max-w-[200px]"
      >
        {url}
      </a>
    </div>
  );
}