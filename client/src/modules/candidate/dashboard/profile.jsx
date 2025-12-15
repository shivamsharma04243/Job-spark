import React, { useEffect, useState } from "react";
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, FileText, Edit2, Save, X } from 'lucide-react';
import api from "../../../components/apiconfig/apiconfig.jsx";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [creatingResume, setCreatingResume] = useState(false);

  const [form, setForm] = useState({
    user_id: "",
    full_name: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    city: "",
    state: "",
    country: "India",
    highest_qualification: "",
    trade_stream: "",
    key_skills: [],
    skill_level: "",
    experience_type: "",
    job_type: "",
    preferred_work_type: "",
    availability: "",
    expected_salary: "",
    id_proof_available: "",
    preferred_contact_method: "",
    willing_to_relocate: false,
    experience_years: "",
    linkedin_url: "",
    github_url: "",
    resume_path: "",
  });

  const [selectedResumeFile, setSelectedResumeFile] = useState(null);
  const [resumeOption, setResumeOption] = useState("have_resume");

  const genderOptions = ["Select", "Male", "Female", "Other"];
  const qualificationOptions = ["Select", "High School", "Diploma", "Bachelor's Degree", "Master's Degree", "PhD", "Other"];
  const skillOptions = ["Computer Basics", "Excel / Data Entry", "Software / IT", "Electrical", "Mechanical", "Plumbing", "Carpentry", "Welding", "Driving", "Communication", "Customer Service"];
  const skillLevelOptions = ["Select", "Beginner", "Intermediate", "Advanced"];
  const experienceTypeOptions = ["Select", "Fresher", "Internship", "1-2 Years", "2+ Years"];
  const jobTypeOptions = ["Select", "Full-Time", "Part-Time", "Internship", "Contract"];
  const workTypeOptions = ["Select", "Office", "Field", "Factory", "Work from Home"];
  const availabilityOptions = ["Select", "Immediately", "Within 7 Days", "Within 15 Days"];
  const idProofOptions = ["Select", "Aadhaar", "PAN", "Driving License", "None"];
  const contactMethodOptions = ["Select", "Call", "WhatsApp"];
  const relocateOptions = ["Select", "Yes", "No"];

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
      // Error loading profile
    } finally {
      try {
        const auth = await api.get('/auth/session');
        const authUser = auth?.data?.user;
        if (authUser) {
          setForm((s) => (s.user_id ? s : { ...s, user_id: authUser.id || authUser.sub || s.user_id }));
        }
      } catch (ignore) { }
      setLoading(false);
    }
  }

  function mapUserToForm(u) {
    let keySkillsArray = [];
    if (u.key_skills) {
      if (Array.isArray(u.key_skills)) {
        keySkillsArray = u.key_skills;
      } else if (typeof u.key_skills === 'string') {
        try {
          const parsed = JSON.parse(u.key_skills);
          keySkillsArray = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          keySkillsArray = u.key_skills.split(",").map(s => s.trim()).filter(s => s);
        }
      }
    }

    let willingToRelocateValue = false;
    if (u.willing_to_relocate !== undefined && u.willing_to_relocate !== null) {
      if (typeof u.willing_to_relocate === 'boolean') {
        willingToRelocateValue = u.willing_to_relocate;
      } else if (typeof u.willing_to_relocate === 'number') {
        willingToRelocateValue = u.willing_to_relocate === 1;
      } else if (typeof u.willing_to_relocate === 'string') {
        const lower = u.willing_to_relocate.toLowerCase();
        willingToRelocateValue = lower === 'yes' || lower === 'true' || lower === '1';
      }
    }

    return {
      user_id: u.user_id || u.id || "",
      full_name: u.full_name || "",
      phone: u.phone || "",
      date_of_birth: u.date_of_birth || "",
      gender: u.gender || "",
      city: u.city || "",
      state: u.state || "",
      country: u.country || "India",
      highest_qualification: u.highest_qualification || "",
      trade_stream: u.trade_stream || "",
      key_skills: keySkillsArray,
      skill_level: u.skill_level || "",
      experience_type: u.experience_type || "",
      job_type: u.job_type || "",
      preferred_work_type: u.preferred_work_type || "",
      availability: u.availability || "",
      expected_salary: u.expected_salary || "",
      id_proof_available: u.id_proof_available || "",
      preferred_contact_method: u.preferred_contact_method || "",
      willing_to_relocate: willingToRelocateValue,
      experience_years: u.experience_years !== undefined && u.experience_years !== null ? String(u.experience_years) : "",
      linkedin_url: u.linkedin_url || "",
      github_url: u.github_url || "",
      resume_path: u.resume_path || "",
    };
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function handleSkillsChange(e) {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setForm((s) => ({ ...s, key_skills: selectedOptions }));
  }

  async function handleCreateResume() {
    setCreatingResume(true);
    setError(null);
    try {
      const res = await api.post("/profile/create-resume", {
        user_id: form.user_id || user?.user_id || user?.id,
        profile_data: form
      });
      if (res?.data?.success) {
        setForm((s) => ({ ...s, resume_path: res.data.resume_path }));
        setUser((u) => ({ ...u, resume_path: res.data.resume_path }));
        alert("Resume created successfully!");
      } else {
        setError(res?.data?.message || "Failed to create resume");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to create resume");
    } finally {
      setCreatingResume(false);
    }
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
          const auth = await api.get('/auth/session');
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
      if (selectedResumeFile && resumeOption === "have_resume") {
        resumePathToSend = await uploadResume(selectedResumeFile);
      } else if (resumeOption === "create_for_me" && !form.resume_path) {
        try {
          const createResumeRes = await api.post("/profile/create-resume", {
            user_id: payloadUserId,
            profile_data: form
          });
          if (createResumeRes?.data?.success) {
            resumePathToSend = createResumeRes.data.resume_path;
          }
        } catch (err) {
          // Could not create resume
        }
      }

      let willingToRelocateBool = false;
      if (form.willing_to_relocate !== undefined && form.willing_to_relocate !== null) {
        if (typeof form.willing_to_relocate === 'boolean') {
          willingToRelocateBool = form.willing_to_relocate;
        } else if (typeof form.willing_to_relocate === 'string') {
          const lower = form.willing_to_relocate.toLowerCase();
          willingToRelocateBool = lower === 'yes' || lower === 'true' || lower === '1';
        } else {
          willingToRelocateBool = Boolean(form.willing_to_relocate);
        }
      }

      const toNullIfEmpty = (value) => {
        if (value === undefined || value === null || value === '') return null;
        return value;
      };

      const payload = {
        user_id: payloadUserId || undefined,
        full_name: form.full_name || null,
        phone: toNullIfEmpty(form.phone),
        date_of_birth: toNullIfEmpty(form.date_of_birth),
        gender: toNullIfEmpty(form.gender),
        city: toNullIfEmpty(form.city),
        state: toNullIfEmpty(form.state),
        country: form.country || "India",
        highest_qualification: toNullIfEmpty(form.highest_qualification),
        trade_stream: toNullIfEmpty(form.trade_stream),
        key_skills: Array.isArray(form.key_skills) && form.key_skills.length > 0 ? form.key_skills : (form.key_skills && !Array.isArray(form.key_skills) ? [form.key_skills] : []),
        skill_level: toNullIfEmpty(form.skill_level),
        experience_type: toNullIfEmpty(form.experience_type),
        job_type: toNullIfEmpty(form.job_type),
        preferred_work_type: toNullIfEmpty(form.preferred_work_type),
        availability: toNullIfEmpty(form.availability),
        expected_salary: toNullIfEmpty(form.expected_salary),
        id_proof_available: toNullIfEmpty(form.id_proof_available),
        preferred_contact_method: toNullIfEmpty(form.preferred_contact_method),
        willing_to_relocate: willingToRelocateBool,
        experience_years: form.experience_years && form.experience_years !== '' ? parseFloat(form.experience_years) : null,
        resume_path: toNullIfEmpty(resumePathToSend),
        linkedin_url: toNullIfEmpty(form.linkedin_url),
        github_url: toNullIfEmpty(form.github_url),
      };

      const res = await api.put("/profile/user", payload);

      if (res?.data?.success) {
        setUser(res.data.user || payload);
        setForm(mapUserToForm(res.data.user || payload));
        setIsEditing(false);
        setSelectedResumeFile(null);

        const applyJobId = localStorage.getItem("postLoginApplyJobId");
        const redirectPath = localStorage.getItem("postLoginRedirect");

        if (applyJobId && redirectPath) {
          localStorage.removeItem("postLoginApplyJobId");
          localStorage.removeItem("postLoginRedirect");
          alert("Profile saved successfully! You can now apply for the job.");
          window.location.href = redirectPath;
          return;
        } else {
          alert("Profile saved successfully!");
        }
      } else {
        const errorMsg = res?.data?.message || res?.data?.error || "Unknown server response";
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.response?.data?.error || err.message || "Failed to save profile";
      setError(errorMsg);
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
    setResumeOption("have_resume");
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-1">Manage your professional information</p>
          </div>
          {!isEditing && user && (
            <button onClick={handleEditClick} className="btn btn-primary px-4 py-2 inline-flex items-center gap-2">
              <Edit2 size={18} />
              Edit Profile
            </button>
          )}
        </div>

        {!isEditing ? (
          <ProfileView user={user} onEdit={handleEditClick} />
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Personal Information */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={20} />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="Enter your phone number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth *</label>
                    <input
                      name="date_of_birth"
                      type="date"
                      value={form.date_of_birth}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender *</label>
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {genderOptions.map(opt => (
                        <option key={opt} value={opt === "Select" ? "" : opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} />
                  Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      placeholder="Enter your city"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">State *</label>
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      required
                      placeholder="Enter your state"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Country *</label>
                    <input
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      required
                      placeholder="Enter your country"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Education & Skills */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap size={20} />
                  Education & Skills
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Highest Qualification *</label>
                    <select
                      name="highest_qualification"
                      value={form.highest_qualification}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {qualificationOptions.map(opt => (
                        <option key={opt} value={opt === "Select" ? "" : opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Trade / Stream *</label>
                    <input
                      name="trade_stream"
                      value={form.trade_stream}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Electrician, Computer"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Key Skills *</label>
                    <select
                      name="key_skills"
                      multiple
                      value={form.key_skills}
                      onChange={handleSkillsChange}
                      required
                      size="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {skillOptions.map(skill => (
                        <option key={skill} value={skill}>{skill}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Skill Level *</label>
                    <select
                      name="skill_level"
                      value={form.skill_level}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {skillLevelOptions.map(opt => (
                        <option key={opt} value={opt === "Select" ? "" : opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase size={20} />
                  Experience
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Experience Type *</label>
                    <select
                      name="experience_type"
                      value={form.experience_type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {experienceTypeOptions.map(opt => (
                        <option key={opt} value={opt === "Select" ? "" : opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Experience Years</label>
                    <input
                      name="experience_years"
                      type="number"
                      step="0.1"
                      min="0"
                      max="99.9"
                      value={form.experience_years}
                      onChange={handleChange}
                      placeholder="e.g., 2.5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Job Preferences */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Type *</label>
                    <select
                      name="job_type"
                      value={form.job_type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {jobTypeOptions.map(opt => (
                        <option key={opt} value={opt === "Select" ? "" : opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Work Type *</label>
                    <select
                      name="preferred_work_type"
                      value={form.preferred_work_type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {workTypeOptions.map(opt => (
                        <option key={opt} value={opt === "Select" ? "" : opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Availability *</label>
                    <select
                      name="availability"
                      value={form.availability}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {availabilityOptions.map(opt => (
                        <option key={opt} value={opt === "Select" ? "" : opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Expected Salary</label>
                    <select
                      name="expected_salary"
                      value={form.expected_salary}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Optional</option>
                      <option value="0-20000">₹0 - ₹20,000</option>
                      <option value="20000-40000">₹20,000 - ₹40,000</option>
                      <option value="40000-60000">₹40,000 - ₹60,000</option>
                      <option value="60000-80000">₹60,000 - ₹80,000</option>
                      <option value="80000+">₹80,000+</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={20} />
                  Documents
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resume Option</label>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="resume_option"
                        value="have_resume"
                        checked={resumeOption === "have_resume"}
                        onChange={(e) => setResumeOption(e.target.value)}
                        className="mr-2 w-4 h-4"
                      />
                      <span className="text-sm">I have a resume</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="resume_option"
                        value="create_for_me"
                        checked={resumeOption === "create_for_me"}
                        onChange={(e) => setResumeOption(e.target.value)}
                        className="mr-2 w-4 h-4"
                      />
                      <span className="text-sm">Create for me</span>
                    </label>
                  </div>
                </div>

                {resumeOption === "have_resume" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText size={24} className="text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedResumeFile ? selectedResumeFile.name : (form.resume_path || 'No file chosen')}
                            </p>
                            <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                          </div>
                        </div>
                        <label className="cursor-pointer">
                          <span className="btn btn-primary btn-sm">Choose File</span>
                          <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileSelect} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {resumeOption === "create_for_me" && (
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={handleCreateResume}
                      disabled={creatingResume}
                      className="btn btn-primary"
                    >
                      {creatingResume ? "Creating Resume..." : "Create Resume"}
                    </button>
                    {form.resume_path && (
                      <p className="text-xs text-green-600 mt-2">Resume created: {form.resume_path}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ID Proof Available *</label>
                  <select
                    name="id_proof_available"
                    value={form.id_proof_available}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {idProofOptions.map(opt => (
                      <option key={opt} value={opt === "Select" ? "" : opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Preference */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Preference</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Preferred Contact Method *</label>
                    <select
                      name="preferred_contact_method"
                      value={form.preferred_contact_method}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {contactMethodOptions.map(opt => (
                        <option key={opt} value={opt === "Select" ? "" : opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Willing to Relocate *</label>
                    <select
                      name="willing_to_relocate"
                      value={form.willing_to_relocate === true || form.willing_to_relocate === "Yes" ? "Yes" : form.willing_to_relocate === false || form.willing_to_relocate === "No" ? "No" : ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setForm((s) => ({ ...s, willing_to_relocate: value === "Yes" }));
                      }}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {relocateOptions.map(opt => (
                        <option key={opt} value={opt === "Select" ? "" : opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Links */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">LinkedIn URL</label>
                    <input
                      name="linkedin_url"
                      value={form.linkedin_url}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      type="url"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">GitHub URL</label>
                    <input
                      name="github_url"
                      value={form.github_url}
                      onChange={handleChange}
                      placeholder="https://github.com/yourusername"
                      type="url"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary px-4 py-2 inline-flex items-center gap-2"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Profile"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-outline px-4 py-2 inline-flex items-center gap-2"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ProfileView({ user, onEdit }) {
  if (!user) {
    return (
      <div className="card">
        <div className="p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <User size={40} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Profile Found</h3>
          <p className="text-gray-600 mb-6">Create your professional profile to get started</p>
          <button onClick={onEdit} className="btn btn-primary">
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Header Card */}
      <div className="card bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-2xl">
              {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.full_name}</h2>
              <p className="text-gray-700">{user.highest_qualification || "Add education"}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <span>{user.experience_years ?? 0} years experience</span>
                <span>•</span>
                <span>{user.phone || "No phone"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} />
              Personal Information
            </h3>
            <div className="space-y-3">
              <InfoItem label="Full Name" value={user.full_name} />
              <InfoItem label="Phone" value={user.phone} />
              <InfoItem label="Date of Birth" value={user.date_of_birth} />
              <InfoItem label="Gender" value={user.gender} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={20} />
              Location
            </h3>
            <div className="space-y-3">
              <InfoItem label="City" value={user.city} />
              <InfoItem label="State" value={user.state} />
              <InfoItem label="Country" value={user.country} />
              <InfoItem label="Willing to Relocate" value={user.willing_to_relocate === 1 || user.willing_to_relocate === true || user.willing_to_relocate === "Yes" ? "Yes" : "No"} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap size={20} />
              Education & Skills
            </h3>
            <div className="space-y-3">
              <InfoItem label="Qualification" value={user.highest_qualification} />
              <InfoItem label="Trade/Stream" value={user.trade_stream} />
              <InfoItem label="Key Skills" value={Array.isArray(user.key_skills) ? user.key_skills.join(", ") : user.key_skills} />
              <InfoItem label="Skill Level" value={user.skill_level} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase size={20} />
              Job Preferences
            </h3>
            <div className="space-y-3">
              <InfoItem label="Experience Type" value={user.experience_type} />
              <InfoItem label="Experience Years" value={user.experience_years !== undefined && user.experience_years !== null ? `${user.experience_years} years` : "—"} />
              <InfoItem label="Job Type" value={user.job_type} />
              <InfoItem label="Expected Salary" value={user.expected_salary} />
            </div>
          </div>
        </div>
      </div>

      {/* Professional Links */}
      {(user.linkedin_url || user.github_url) && (
        <div className="card">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Links</h3>
            <div className="space-y-3">
              {user.linkedin_url && <LinkItem label="LinkedIn" url={user.linkedin_url} />}
              {user.github_url && <LinkItem label="GitHub" url={user.github_url} />}
            </div>
          </div>
        </div>
      )}

      {/* Resume */}
      {user.resume_path && (() => {
        let resumeUrl = user.resume_path;
        if (!resumeUrl.startsWith('http')) {
          const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
          const serverBase = apiBase.replace('/api', '');
          const resumePath = resumeUrl.startsWith('/') ? resumeUrl : `/${resumeUrl}`;
          resumeUrl = `${serverBase}${resumePath}`;
        }

        return (
          <div className="card">
            <div className="p-6">
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <FileText size={18} />
                View Resume
              </a>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value || "—"}</span>
    </div>
  );
}

function LinkItem({ label, url }) {
  if (!url) return null;

  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <span className="text-sm text-gray-600">{label}</span>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-sm text-blue-600 hover:text-blue-700 font-medium truncate max-w-xs"
      >
        {url}
      </a>
    </div>
  );
}
