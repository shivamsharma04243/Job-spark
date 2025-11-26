import React, { useEffect, useState } from "react";
// Adjust this import to match where your apiconfig file lives in the frontend project
// Example: import api from "../../components/apiconfig/apiconfig";
import api from "../../../components/apiconfig/apiconfig";

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

  // local file selection for user convenience (not automatically uploaded)
  const [selectedResumeFile, setSelectedResumeFile] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    setError(null);
    // Try to fetch existing profile (optional)
    try {
      const res = await api.get("/profile/user");

      if (res?.data?.success && res.data.user) {
        setUser(res.data.user);
        setForm(mapUserToForm(res.data.user));
      }
    } catch (err) {
      // Non-fatal: keep user as null so frontend can create profile via PUT
      console.warn("Could not load profile (GET /api/profile/user) — continuing:", err?.response?.status || err.message);
    } finally {
      // After attempting profile fetch, always try authcheck to populate user_id
      try {
        const auth = await api.get('/auth/authcheck');
        const authUser = auth?.data?.user;
        if (authUser) {
          setForm((s) => (s.user_id ? s : { ...s, user_id: authUser.id || authUser.sub || s.user_id }));
        }
      } catch (ignore) {
        // Non-fatal: authcheck may fail if session expired; it's okay to proceed.
      }

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
    // show filename in the resume_path field as a hint; actual upload depends on your backend
    setForm((s) => ({ ...s, resume_path: file ? file.name : s.resume_path }));
  }

  async function uploadResume(file) {
    // Placeholder helper. By default your API expects `resume_path` string.
    // If you implement a resume upload endpoint, send FormData here and return the uploaded file path/url.
    // Example implementation (requires backend /api/profile/upload handling):
    // const fd = new FormData(); fd.append('resume', file);
    // const r = await api.post('/profile/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    // return r.data?.path;

    // For now, return the filename so your backend can store that string.
    return file ? file.name : null;
  }

  async function handleSave(e) {
    e?.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // If we don't have a user_id yet, do a final auth-check before attempting to save.
      let payloadUserId = form.user_id;
      if (!payloadUserId) {
        try {
          const auth = await api.get('/auth/authcheck');
          const authUser = auth?.data?.user;
          if (authUser) {
            payloadUserId = authUser.id || authUser.sub || payloadUserId;
            // Update the form as well to reflect the auth user id
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
        // Attempt to upload if user selected a new file. If your backend doesn't support file uploads,
        // uploadResume will simply return file.name and we will send that to the API.
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
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">My Profile</h1>
        <p className="text-sm text-gray-600 mt-1">View and edit your profile information.</p>
      </header>

      {loading ? (
        <div className="p-6 bg-white rounded shadow text-center">Loading profile…</div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            {!isEditing ? (
              <ProfileView user={user} onEdit={handleEditClick} />
            ) : (
              <form onSubmit={handleSave} className="space-y-6">
                {error && (
                  <div className="text-sm text-red-600">{error}</div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Full name" name="full_name" value={form.full_name} onChange={handleChange} required />
                  <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} required />
                  <Input label="City" name="city" value={form.city} onChange={handleChange} />
                  <Input label="State" name="state" value={form.state} onChange={handleChange} />
                  <Input label="Country" name="country" value={form.country} onChange={handleChange} />
                  <Input label="Experience (years)" name="experience_years" value={form.experience_years} onChange={handleChange} type="number" min="0" />
                  <Input label="Highest education" name="highest_education" value={form.highest_education} onChange={handleChange} />
                  <Input label="LinkedIn URL" name="linkedin_url" value={form.linkedin_url} onChange={handleChange} />
                  <Input label="Portfolio URL" name="portfolio_url" value={form.portfolio_url} onChange={handleChange} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Resume (optional)</label>
                  <div className="mt-1 flex items-center gap-4">
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileSelect} />
                    <div className="text-sm text-gray-600">{selectedResumeFile ? selectedResumeFile.name : (form.resume_path || 'No resume uploaded')}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 disabled:opacity-60">
                    {saving ? 'Saving...' : 'Save profile'}
                  </button>
                  <button type="button" onClick={handleCancel} className="px-4 py-2 border rounded">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileView({ user, onEdit }) {
  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-700 mb-4">No profile found. Create your profile to get started.</p>
        <button onClick={onEdit} className="px-4 py-2 bg-green-600 text-white rounded">Create profile</button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="p-4 border rounded">
          <h2 className="font-semibold text-lg">{user.full_name}</h2>
          <p className="text-sm text-gray-600">{user.highest_education || '—'}</p>
          <p className="mt-3 text-sm text-gray-700">Phone: {user.phone}</p>
          <p className="text-sm text-gray-700">Experience: {user.experience_years ?? 0} years</p>

          <div className="mt-4 flex gap-2">
            <button onClick={onEdit} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Edit</button>
          </div>
        </div>

        <div className="mt-4 p-4 border rounded">
          <h3 className="font-medium text-sm">Resume</h3>
          {user.resume_path ? (
            <a href={user.resume_path} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline">View resume</a>
          ) : (
            <p className="text-sm text-gray-600">Not uploaded</p>
          )}
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="p-4 border rounded mb-4">
          <h3 className="font-medium">Contact & Location</h3>
          <p className="text-sm text-gray-700 mt-2">City: {user.city || '—'}</p>
          <p className="text-sm text-gray-700">State: {user.state || '—'}</p>
          <p className="text-sm text-gray-700">Country: {user.country || '—'}</p>
        </div>

        <div className="p-4 border rounded">
          <h3 className="font-medium">Links</h3>
          <ul className="mt-2 space-y-2">
            <li>
              <strong className="mr-2">LinkedIn:</strong>
              {user.linkedin_url ? (
                <a href={user.linkedin_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">{user.linkedin_url}</a>
              ) : (
                <span className="text-gray-600">—</span>
              )}
            </li>
            <li>
              <strong className="mr-2">Portfolio:</strong>
              {user.portfolio_url ? (
                <a href={user.portfolio_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">{user.portfolio_url}</a>
              ) : (
                <span className="text-gray-600">—</span>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text", ...rest }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        {...rest}
        className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-offset-1"
      />
    </label>
  );
}
