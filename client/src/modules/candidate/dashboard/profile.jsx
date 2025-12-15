import React, { useEffect, useState } from "react";
import api from "../../../components/apiconfig/apiconfig.jsx";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [creatingResume, setCreatingResume] = useState(false);

  // form state
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
  const [resumeOption, setResumeOption] = useState("have_resume"); // "have_resume" or "create_for_me"

  // Available options for dropdowns - matching database schema enums
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
    // Handle key_skills - could be JSON array or comma-separated string
    let keySkillsArray = [];
    if (u.key_skills) {
      if (Array.isArray(u.key_skills)) {
        keySkillsArray = u.key_skills;
      } else if (typeof u.key_skills === 'string') {
        try {
          // Try parsing as JSON first
          const parsed = JSON.parse(u.key_skills);
          keySkillsArray = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          // If not JSON, treat as comma-separated string
          keySkillsArray = u.key_skills.split(",").map(s => s.trim()).filter(s => s);
        }
      }
    }

    // Handle willing_to_relocate - convert tinyint to boolean/string
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
        // Create resume if user selected "Create for me" and doesn't have one
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

      // Convert willing_to_relocate to boolean
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

      // Helper to convert empty strings to null
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

        // Check if user came from apply flow
        const applyJobId = localStorage.getItem("postLoginApplyJobId");
        const redirectPath = localStorage.getItem("postLoginRedirect");

        if (applyJobId && redirectPath) {
          // Profile is now complete - redirect back to job page
          // User will need to click Apply Now button manually
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {/* Card Header */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-border bg-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-text-dark">Candidate Profile Information</h3>
            <p className="text-sm sm:text-base text-text-muted mt-1">Update your professional details and contact information</p>
          </div>
          {!isEditing && (
            <button
              onClick={handleEditClick}
              className="btn btn-primary btn-md self-start sm:self-auto"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {!isEditing ? (
          <ProfileView user={user} onEdit={handleEditClick} />
        ) : (
          <form onSubmit={handleSave} className="space-y-6 sm:space-y-8">
            {error && (
              <div className="p-4 bg-error-light border border-error-300 rounded-lg text-error-700 text-sm">
                {error}
              </div>
            )}

            {/* Personal Information */}
            <div className="border border-border rounded-card card-padding">
              <h4 className="text-base font-semibold text-text-dark mb-5">Personal Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="label">Full Name *</label>
                  <input
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Phone Number *</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter your phone number"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Date of Birth *</label>
                  <div className="relative">
                    <input
                      name="date_of_birth"
                      type="date"
                      value={form.date_of_birth}
                      onChange={handleChange}
                      required
                      placeholder="dd-mm-yyyy"
                      className="input pr-10"
                    />
                    <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <label className="label">Gender *</label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    required
                    className="select"
                  >
                    {genderOptions.map(opt => (
                      <option key={opt} value={opt === "Select" ? "" : opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="border border-border rounded-card card-padding">
              <h4 className="text-base font-semibold text-text-dark mb-5">Location</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                <div>
                  <label className="label">City *</label>
                  <input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    placeholder="Enter your city"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">State *</label>
                  <input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                    placeholder="Enter your state"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Country *</label>
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    required
                    placeholder="Enter your country"
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Education & Skills */}
            <div className="border border-border rounded-card card-padding">
              <h4 className="text-base font-semibold text-text-dark mb-5">Education & Skills</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="label">Highest Qualification *</label>
                  <select
                    name="highest_qualification"
                    value={form.highest_qualification}
                    onChange={handleChange}
                    required
                    className="select"
                  >
                    {qualificationOptions.map(opt => (
                      <option key={opt} value={opt === "Select" ? "" : opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Trade / Stream *</label>
                  <input
                    name="trade_stream"
                    value={form.trade_stream}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Electrician, Computer"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Key Skills *</label>
                  <select
                    name="key_skills"
                    multiple
                    value={form.key_skills}
                    onChange={handleSkillsChange}
                    required
                    size="4"
                    className="select"
                  >
                    {skillOptions.map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                  <p className="text-xs text-text-muted mt-1.5">Hold Ctrl/Cmd to select multiple</p>
                </div>
                <div>
                  <label className="label">Skill Level *</label>
                  <select
                    name="skill_level"
                    value={form.skill_level}
                    onChange={handleChange}
                    required
                    className="select"
                  >
                    {skillLevelOptions.map(opt => (
                      <option key={opt} value={opt === "Select" ? "" : opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="border border-border rounded-card card-padding">
              <h4 className="text-base font-semibold text-text-dark mb-5">Experience</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="label">Experience Type *</label>
                  <select
                    name="experience_type"
                    value={form.experience_type}
                    onChange={handleChange}
                    required
                    className="select"
                  >
                    {experienceTypeOptions.map(opt => (
                      <option key={opt} value={opt === "Select" ? "" : opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Experience Years</label>
                  <input
                    name="experience_years"
                    type="number"
                    step="0.1"
                    min="0"
                    max="99.9"
                    value={form.experience_years}
                    onChange={handleChange}
                    placeholder="e.g., 2.5"
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Job Preferences */}
            <div className="border border-border rounded-card card-padding">
              <h4 className="text-base font-semibold text-text-dark mb-5">Job Preferences</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="label">Job Type *</label>
                  <select
                    name="job_type"
                    value={form.job_type}
                    onChange={handleChange}
                    required
                    className="select"
                  >
                    {jobTypeOptions.map(opt => (
                      <option key={opt} value={opt === "Select" ? "" : opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Preferred Work Type *</label>
                  <select
                    name="preferred_work_type"
                    value={form.preferred_work_type}
                    onChange={handleChange}
                    required
                    className="select"
                  >
                    {workTypeOptions.map(opt => (
                      <option key={opt} value={opt === "Select" ? "" : opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Availability *</label>
                  <select
                    name="availability"
                    value={form.availability}
                    onChange={handleChange}
                    required
                    className="select"
                  >
                    {availabilityOptions.map(opt => (
                      <option key={opt} value={opt === "Select" ? "" : opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Expected Salary</label>
                  <select
                    name="expected_salary"
                    value={form.expected_salary}
                    onChange={handleChange}
                    className="select"
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



            {/* Documents */}
            <div className="border border-border rounded-card card-padding">
              <h4 className="text-base font-semibold text-text-dark mb-5">Documents</h4>

              {/* Resume Option Radio Buttons */}
              <div className="mb-5">
                <label className="label mb-3">Resume Option</label>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="resume_option"
                      value="have_resume"
                      checked={resumeOption === "have_resume"}
                      onChange={(e) => setResumeOption(e.target.value)}
                      className="mr-2 w-4 h-4 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                    <span className="text-sm text-text-dark">I have a resume</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="resume_option"
                      value="create_for_me"
                      checked={resumeOption === "create_for_me"}
                      onChange={(e) => setResumeOption(e.target.value)}
                      className="mr-2 w-4 h-4 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                    <span className="text-sm text-text-dark">Create for me</span>
                  </label>
                </div>
              </div>

              {/* Resume Upload (shown when "I have a resume" is selected) */}
              {resumeOption === "have_resume" && (
                <div className="mb-5">
                  <label className="label mb-3">Upload Resume / Certificate (Optional)</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 sm:p-5 hover:border-primary-300 transition-colors bg-gray-50">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-button bg-primary-50 flex items-center justify-center text-primary-600 mr-3 flex-shrink-0">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-text-dark truncate">
                            {selectedResumeFile ? selectedResumeFile.name : (form.resume_path || 'No file chosen')}
                          </p>
                          <p className="text-xs text-text-muted">PDF, DOC, DOCX up to 10MB</p>
                        </div>
                      </div>
                      <label className="cursor-pointer flex-shrink-0">
                        <span className="btn btn-primary btn-sm">
                          Choose File
                        </span>
                        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileSelect} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Create Resume Button (shown when "Create for me" is selected) */}
              {resumeOption === "create_for_me" && (
                <div className="mb-5">
                  <button
                    type="button"
                    onClick={handleCreateResume}
                    disabled={creatingResume}
                    className="btn btn-primary btn-md"
                  >
                    {creatingResume ? "Creating Resume..." : "Create Resume"}
                  </button>
                  {form.resume_path && (
                    <p className="text-xs text-success-600 mt-2 font-medium">Resume created: {form.resume_path}</p>
                  )}
                </div>
              )}

              {/* ID Proof Available */}
              <div>
                <label className="label">ID Proof Available *</label>
                <select
                  name="id_proof_available"
                  value={form.id_proof_available}
                  onChange={handleChange}
                  required
                  className="select"
                >
                  {idProofOptions.map(opt => (
                    <option key={opt} value={opt === "Select" ? "" : opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Preference */}
            <div className="border border-border rounded-card card-padding">
              <h4 className="text-base font-semibold text-text-dark mb-5">Contact Preference</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="label">Preferred Contact Method *</label>
                  <select
                    name="preferred_contact_method"
                    value={form.preferred_contact_method}
                    onChange={handleChange}
                    required
                    className="select"
                  >
                    {contactMethodOptions.map(opt => (
                      <option key={opt} value={opt === "Select" ? "" : opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Willing to Relocate *</label>
                  <select
                    name="willing_to_relocate"
                    value={form.willing_to_relocate === true || form.willing_to_relocate === "Yes" ? "Yes" : form.willing_to_relocate === false || form.willing_to_relocate === "No" ? "No" : ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setForm((s) => ({ ...s, willing_to_relocate: value === "Yes" }));
                    }}
                    required
                    className="select"
                  >
                    {relocateOptions.map(opt => (
                      <option key={opt} value={opt === "Select" ? "" : opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {/* Professional Links */}
            <div className="border border-border rounded-card card-padding">
              <h4 className="text-base font-semibold text-text-dark mb-5">Professional Links</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="label">LinkedIn URL</label>
                  <input
                    name="linkedin_url"
                    value={form.linkedin_url}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    type="url"
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">GitHub URL</label>
                  <input
                    name="github_url"
                    value={form.github_url}
                    onChange={handleChange}
                    placeholder="https://github.com/yourusername"
                    type="url"
                    className="input"
                  />
                </div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3 pt-6 border-t border-border">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary btn-md sm:w-auto w-full"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-outline btn-md sm:w-auto w-full"
              >
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
      <div className="text-center py-8 sm:py-12">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 mx-auto mb-4">
          <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-text-dark mb-2">No Profile Found</h3>
        <p className="text-text-muted text-sm sm:text-base mb-6">Create your professional profile to get started</p>
        <button
          onClick={onEdit}
          className="btn btn-primary btn-md"
        >
          Create Profile
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* User Info Card */}
      <div className="bg-primary-50 rounded-card card-padding border border-primary-200">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-xl sm:text-2xl flex-shrink-0">
            {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-semibold text-text-dark text-lg sm:text-xl mb-1">{user.full_name}</h3>
            <p className="text-text-muted text-sm sm:text-base mb-2">{user.highest_qualification || "Add education"}</p>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 text-sm">
              <span className="text-text-dark">{user.experience_years ?? 0} years experience</span>
              <span className="text-text-dark">{user.phone || "No phone"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div>
          <h4 className="text-base font-semibold text-text-dark mb-4">Personal Information</h4>
          <div className="space-y-3">
            <InfoItem label="Full Name" value={user.full_name} />
            <InfoItem label="Phone" value={user.phone} />
            <InfoItem label="Date of Birth" value={user.date_of_birth} />
            <InfoItem label="Gender" value={user.gender} />
            <InfoItem label="Highest Qualification" value={user.highest_qualification || user.highest_qualification} />
            <InfoItem label="Trade/Stream" value={user.trade_stream} />
            <InfoItem label="Key Skills" value={Array.isArray(user.key_skills) ? user.key_skills.join(", ") : user.key_skills} />
            <InfoItem label="Skill Level" value={user.skill_level} />
          </div>
        </div>

        <div>
          <h4 className="text-base font-semibold text-text-dark mb-4">Location & Preferences</h4>
          <div className="space-y-3">
            <InfoItem label="City" value={user.city} />
            <InfoItem label="State" value={user.state} />
            <InfoItem label="Country" value={user.country} />
            <InfoItem label="Experience Type" value={user.experience_type} />
            <InfoItem label="Experience Years" value={user.experience_years !== undefined && user.experience_years !== null ? `${user.experience_years} years` : "—"} />
            <InfoItem label="Job Type" value={user.job_type} />
            <InfoItem label="Preferred Work Type" value={user.preferred_work_type} />
            <InfoItem label="Availability" value={user.availability} />
            <InfoItem label="Expected Salary" value={user.expected_salary} />
          </div>
        </div>
      </div>

      {/* Contact & Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div>
          <h4 className="text-base font-semibold text-text-dark mb-4">Contact Preference</h4>
          <div className="space-y-3">
            <InfoItem label="Preferred Contact Method" value={user.preferred_contact_method} />
            <InfoItem label="Willing to Relocate" value={user.willing_to_relocate === 1 || user.willing_to_relocate === true || user.willing_to_relocate === "Yes" ? "Yes" : user.willing_to_relocate === 0 || user.willing_to_relocate === false || user.willing_to_relocate === "No" ? "No" : "—"} />
            <InfoItem label="ID Proof Available" value={user.id_proof_available} />
          </div>
        </div>
      </div>

      {/* Professional Links */}
      <div>
        <h4 className="text-base font-semibold text-text-dark mb-4">Professional Links</h4>
        <div className="space-y-3">
          <LinkItem label="LinkedIn" url={user.linkedin_url} />
          <LinkItem label="GitHub" url={user.github_url} />
        </div>
      </div>

      {/* Resume */}
      {user.resume_path && (() => {
        // Construct the resume URL - use full server URL if relative path
        let resumeUrl = user.resume_path;
        if (!resumeUrl.startsWith('http')) {
          // Get the API base URL (without /api)
          const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
          const serverBase = apiBase.replace('/api', '');
          // Ensure resume_path starts with / if it doesn't already
          const resumePath = resumeUrl.startsWith('/') ? resumeUrl : `/${resumeUrl}`;
          resumeUrl = `${serverBase}${resumePath}`;
        }

        return (
          <div className="border-t border-slate-200 pt-4">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Resume
            </a>
          </div>
        );
      })()}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2.5 border-b border-border last:border-0 gap-1 sm:gap-2">
      <span className="text-sm text-text-muted">{label}</span>
      <span className="text-sm font-semibold text-text-dark text-left sm:text-right">{value || "—"}</span>
    </div>
  );
}

function LinkItem({ label, url }) {
  if (!url) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2.5 border-b border-border gap-1 sm:gap-2">
        <span className="text-sm text-text-muted">{label}</span>
        <span className="text-sm text-text-light">Not provided</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2.5 border-b border-border gap-1 sm:gap-2">
      <span className="text-sm text-text-muted">{label}</span>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-sm text-primary-600 hover:text-primary-700 font-medium truncate max-w-full sm:max-w-[200px] text-left sm:text-right"
      >
        {url}
      </a>
    </div>
  );
}