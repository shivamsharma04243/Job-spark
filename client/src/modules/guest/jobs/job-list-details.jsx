import { Building2, MapPin, Clock, Briefcase, GraduationCap, Bookmark, BookmarkCheck } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../components/apiconfig/apiconfig";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false); // Track if job is saved
  const [isApplied, setIsApplied] = useState(false); // Track if job is already applied
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  // Application form state (only for non-logged-in users)
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeLink, setResumeLink] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  // For logged-in users: optional resume update
  const [updateResumeFile, setUpdateResumeFile] = useState(null);

  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState(null);
  const [applySuccess, setApplySuccess] = useState(null);
  const [applied, setApplied] = useState(false); // set true after success

  // Check if job is already applied
  const checkAppliedStatus = async (jobId) => {
    try {
      const response = await api.get("/jobs/applied-jobs");
      if (response.data?.ok && response.data.applications) {
        const applied = response.data.applications.some(app => app.job_id === Number(jobId));
        setIsApplied(applied);
        // If applied, also set isSaved to false (since applied jobs can't be saved)
        if (applied) {
          setIsSaved(false);
        }
      }
    } catch (error) {
      console.error('Error checking applied status:', error);
      setIsApplied(false);
    }
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/jobs/${id}`);
        if (!alive) return;
        if (data.ok && data.job) {
          setJob(data.job);

          // Check if job is saved
          await checkSavedStatus(id);
        } else {
          setError(data.message || "Job not found");
        }
      } catch (err) {
        console.error("Failed to fetch job:", err);
        setError(err?.response?.data?.message || err.message || "Failed to load job");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get("/auth/session");
        if (alive) {
          setIsAuthenticated(Boolean(data?.user));
          if (data?.user) {
            setUserEmail(data.user.email);
            // Fetch candidate profile if authenticated
            await loadCandidateProfile();
            // Check if job is already applied
            await checkAppliedStatus(id);
          }
        }
      } catch (err) {
        if (alive) setIsAuthenticated(false);
      } finally {
        if (alive) setAuthChecked(true);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  // Load candidate profile for logged-in users
  const loadCandidateProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await api.get("/profile/user");
      if (res?.data?.success && res.data.user) {
        setCandidateProfile(res.data.user);
      }
    } catch (err) {
      // Profile doesn't exist or error - that's okay, user will need to complete it
      setCandidateProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  // Check if profile is complete (has name, email, and resume)
  const isProfileComplete = () => {
    if (!candidateProfile) return false;
    return !!(
      candidateProfile.full_name &&
      userEmail &&
      candidateProfile.resume_path
    );
  };

  // Check if job is saved
  const checkSavedStatus = async (jobId) => {
    try {
      const response = await api.get(`/jobs/save/${jobId}`);
      setIsSaved(response.data.isSaved);
    } catch (error) {
      console.error('Error checking saved status:', error);
      setIsSaved(false);
    }
  };

  const redirectToLoginForSave = () => {
    try {
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem("postLoginSaveJobId", id);
      localStorage.setItem("postLoginRedirect", currentPath || `/jobs/${id}`);
    } catch (err) {
      // ignore storage failures
    }
    navigate("/sign-in");
  };

  const toggleSave = async () => {
    if (!isAuthenticated) {
      if (!authChecked) {
        try {
          const { data } = await api.get("/auth/session");
          if (data?.user) {
            setIsAuthenticated(true);
          } else {
            redirectToLoginForSave();
            return;
          }
        } catch (err) {
          redirectToLoginForSave();
          return;
        }
      } else {
        redirectToLoginForSave();
        return;
      }
    }

    try {
      if (isSaved) {
        // Unsave the job
        await api.delete(`/jobs/save/${id}`);
        setIsSaved(false);
      } else {
        // Save the job
        await api.post(`/jobs/save/${id}`);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      const errorMessage = error.response?.data?.message || error.message;
      // Show specific message if trying to save an applied job
      if (errorMessage.includes('already applied')) {
        alert('Cannot save a job you have already applied to');
        setIsApplied(true);
      } else {
        alert('Error: ' + errorMessage);
      }
    }
  };

  const skills = job?.tags || [];
  const responsibilities = job?.responsibilities || [];
  const qualifications = job?.qualifications || [];

  // Format salary (monthly) with rupee symbol
  const formatSalaryMonthly = () => {
    if (!job) return 'NA';

    // Use minSalary and maxSalary if available (preferred)
    const minSalary = job.minSalary;
    const maxSalary = job.maxSalary;

    if (minSalary != null && maxSalary != null) {
      // Format monthly salary with rupee symbol
      return `₹ ${Number(minSalary).toLocaleString('en-IN')} - ${Number(maxSalary).toLocaleString('en-IN')} /Month`;
    } else if (minSalary != null) {
      return `₹ ${Number(minSalary).toLocaleString('en-IN')}+ /Month`;
    } else if (maxSalary != null) {
      return `Up to ₹ ${Number(maxSalary).toLocaleString('en-IN')} /Month`;
    }

    // Fallback: try to parse from salary string if min/max not available
    if (job.salary && typeof job.salary === 'string') {
      const match = job.salary.match(/(\d+)-(\d+)\s*(?:per month|\/Month)/i);
      if (match) {
        const min = parseInt(match[1]);
        const max = parseInt(match[2]);
        return `₹ ${min.toLocaleString('en-IN')} - ${max.toLocaleString('en-IN')} /Month`;
      }
      const singleMatch = job.salary.match(/(\d+)\+\s*(?:per month|\/Month)/i);
      if (singleMatch) {
        const min = parseInt(singleMatch[1]);
        return `₹ ${min.toLocaleString('en-IN')}+ /Month`;
      }
      // Also handle old LPA format for backward compatibility
      const lpaMatch = job.salary.match(/(\d+)-(\d+)\s*LPA/i);
      if (lpaMatch) {
        const min = parseInt(lpaMatch[1]);
        const max = parseInt(lpaMatch[2]);
        return `₹ ${min.toLocaleString('en-IN')} - ${max.toLocaleString('en-IN')} /Month`;
      }
    }

    return 'NA';
  };

  // Basic client-side validation for file type/size
  const onFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    if (!f) {
      setResumeFile(null);
      return;
    }
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = f.name.substring(f.name.lastIndexOf(".")).toLowerCase();
    if (!allowed.includes(ext)) {
      setApplyError("Only PDF / DOC / DOCX files are allowed for resume.");
      setResumeFile(null);
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (f.size > maxSize) {
      setApplyError("Resume must be smaller than 5 MB.");
      setResumeFile(null);
      return;
    }
    setApplyError(null);
    setResumeFile(f);
  };

  // Redirect to login for non-logged-in users
  const redirectToLoginForApply = () => {
    try {
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem("postLoginApplyJobId", id);
      localStorage.setItem("postLoginRedirect", currentPath || `/jobs/${id}`);
    } catch (err) {
      // ignore storage failures
    }
    navigate("/sign-in?role=candidate");
  };

  const submitApplication = async () => {
    setApplyError(null);
    setApplySuccess(null);

    // Check authentication first
    if (!isAuthenticated) {
      redirectToLoginForApply();
      return;
    }

    // For logged-in users: check if profile is complete
    if (isAuthenticated && !isProfileComplete()) {
      // Redirect to complete profile, then come back to apply
      try {
        localStorage.setItem("postLoginApplyJobId", id);
        localStorage.setItem("postLoginRedirect", window.location.pathname + window.location.search);
      } catch (err) {
        // ignore storage failures
      }
      navigate("/dashboard/profile");
      return;
    }

    if (!id) {
      setApplyError("Job ID missing.");
      return;
    }

    try {
      setApplying(true);

      const formData = new FormData();
      formData.append("job_id", id);

      if (isAuthenticated && candidateProfile) {
        // For logged-in users: use profile data
        // Only send cover letter and optional resume update
        if (coverLetter) formData.append("cover_letter", coverLetter);

        // If user wants to update resume, use the new file
        if (updateResumeFile) {
          formData.append("resume", updateResumeFile);
        }
        // Otherwise, backend should use resume_path from profile
        // We'll send it in the body if backend supports it
        if (!updateResumeFile && candidateProfile.resume_path) {
          formData.append("resume_path", candidateProfile.resume_path);
        }
      } else {
        // For non-logged-in users: use form data
        if (coverLetter) formData.append("cover_letter", coverLetter);
        if (applicantName) formData.append("applicant_name", applicantName);
        if (applicantEmail) formData.append("applicant_email", applicantEmail);
        if (resumeFile) formData.append("resume", resumeFile);
        if (!resumeFile && resumeLink) formData.append("resume_link", resumeLink);
      }

      const res = await api.post("/jobs/apply", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data && res.data.ok) {
        setApplySuccess("You have successfully applied for this job");
        setApplied(true);
        setIsApplied(true); // Mark as applied
        // Remove from saved jobs (if it was saved) - backend handles this automatically
        setIsSaved(false);
        // Clear form
        setCoverLetter("");
        setResumeFile(null);
        setResumeLink("");
        setUpdateResumeFile(null);
      } else {
        setApplyError(res.data?.error || res.data?.message || "Failed to submit application");
      }
    } catch (err) {
      console.error("Apply error:", err);
      setApplyError(err?.response?.data?.error || err?.response?.data?.message || err.message || "Server error while applying");
    } finally {
      setApplying(false);
    }
  };

  // Render
  if (loading) return <div className="p-6 text-gray-600">Loading job...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!job) return <div className="p-6 text-gray-600">Job not found</div>;

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="mb-3 text-sm text-text-muted">
                <a href="/jobs" className="hover:underline text-primary-600 font-medium">Jobs</a> / <span className="text-text-dark">{job.title}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-dark mb-3">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="badge badge-gray inline-flex items-center gap-1.5">
                  <Building2 size={14} className="text-primary-500" /> {job.company}
                </span>
                <span className="badge badge-gray inline-flex items-center gap-1.5">
                  <MapPin size={14} className="text-primary-500" /> {job.location}
                </span>
                <span className="badge badge-primary">
                  <Clock size={14} className="inline mr-1" /> {job.type}
                </span>
                <span className="badge badge-primary">
                  <Briefcase size={14} className="inline mr-1" /> {job.type}
                </span>
                {job.experiance && (
                  <span className="badge badge-primary">
                    <GraduationCap size={14} className="inline mr-1" /> {job.experiance}
                  </span>
                )}
              </div>
            </div>

            <div className="card">
              <div className="border-b border-border p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-text-dark">About the role</h2>
              </div>
              <div className="space-y-5 text-text-dark p-4 sm:p-6">
                <p className="text-sm sm:text-base leading-relaxed">{job.description}</p>
                <div>
                  <p className="font-semibold mb-2 text-text-dark text-base">Responsibilities</p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 text-sm sm:text-base text-text-muted">
                    {responsibilities.length ? responsibilities.map((r) => <li key={r}>{r}</li>) : <li>Responsibilities not provided</li>}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold mb-2 text-text-dark text-base">Qualifications</p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 text-sm sm:text-base text-text-muted">
                    {qualifications.length ? qualifications.map((q) => <li key={q}>{q}</li>) : <li>Qualifications not provided</li>}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="badge badge-primary"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-4 lg:self-start">
            <div className="card">
              <div className="border-b border-border p-4 sm:p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg sm:text-xl font-semibold text-text-dark">Apply to this job</h2>
                  {!isApplied && (
                    <button
                      onClick={toggleSave}
                      className="flex items-center gap-1.5 border-2 border-primary-300 text-primary-700 hover:bg-primary-50 hover:text-primary-800 text-xs px-3 py-1.5 rounded-button transition-colors"
                    >
                      {isSaved ? (
                        <>
                          <BookmarkCheck size={14} className="text-primary-600" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Bookmark size={14} />
                          Save
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="space-y-3 text-sm text-text-dark mb-5 sm:mb-6 pb-4 border-b border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Compensation</span>
                    <span className="font-semibold text-primary-600">{formatSalaryMonthly()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Work Mode</span>
                    <span className="font-semibold text-primary-600">{job.workMode || job.mode || 'Office'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Experience</span>
                    <span className="font-semibold text-primary-600">{job.experiance || job.experience || 'Not specified'}</span>
                  </div>
                </div>

                {isAuthenticated && candidateProfile ? (
                  // Logged-in user: Simplified form
                  <div className="space-y-4">
                    {/* Show profile info */}
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 sm:p-4 text-sm">
                      <div className="font-semibold text-primary-900 mb-1.5">Applying as:</div>
                      <div className="text-text-dark font-medium">{candidateProfile.full_name || "Your name"}</div>
                      <div className="text-text-muted text-xs mt-1">{userEmail}</div>
                      {candidateProfile.resume_path && (
                        <div className="text-success-600 text-xs mt-1.5 font-medium">✓ Resume on file</div>
                      )}
                    </div>

                    {/* Optional resume update */}
                    {candidateProfile.resume_path && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="label text-sm">Resume</label>
                          <button
                            type="button"
                            onClick={() => document.getElementById('update-resume-input')?.click()}
                            className="text-xs text-primary-600 hover:text-primary-700 underline font-medium"
                          >
                            Update Resume
                          </button>
                        </div>
                        <input
                          id="update-resume-input"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const f = e.target.files?.[0] || null;
                            if (!f) {
                              setUpdateResumeFile(null);
                              return;
                            }
                            const allowed = [".pdf", ".doc", ".docx"];
                            const ext = f.name.substring(f.name.lastIndexOf(".")).toLowerCase();
                            if (!allowed.includes(ext)) {
                              setApplyError("Only PDF / DOC / DOCX files are allowed for resume.");
                              setUpdateResumeFile(null);
                              return;
                            }
                            const maxSize = 5 * 1024 * 1024; // 5 MB
                            if (f.size > maxSize) {
                              setApplyError("Resume must be smaller than 5 MB.");
                              setUpdateResumeFile(null);
                              return;
                            }
                            setApplyError(null);
                            setUpdateResumeFile(f);
                          }}
                          className="hidden"
                        />
                        {updateResumeFile && (
                          <div className="text-xs mt-1.5 text-primary-600 font-medium">New file: {updateResumeFile.name}</div>
                        )}
                      </div>
                    )}

                    {/* Cover letter */}
                    <div>
                      <label className="label text-sm">Cover letter (optional)</label>
                      <textarea
                        rows={4}
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="textarea"
                        placeholder="Tell us why you're a good fit for this role..."
                      />
                    </div>

                    {applyError && (
                      <div className="text-error-600 text-sm bg-error-light border border-error-300 p-3 rounded-lg">
                        {applyError}
                      </div>
                    )}
                    {applySuccess && (
                      <div className="text-success-600 text-sm bg-success-light border border-success-300 p-3 rounded-lg">
                        {applySuccess}
                      </div>
                    )}

                    <button
                      className="btn btn-primary btn-md w-full"
                      onClick={submitApplication}
                      disabled={applying || applied || profileLoading}
                    >
                      {applied ? "Applied" : applying ? "Applying..." : "Apply Now"}
                    </button>
                  </div>
                ) : (
                  // Non-logged-in user: Just Sign in to Apply Now button (no form fields)
                  <div className="space-y-3">
                    <button
                      className="btn btn-primary btn-md w-full"
                      onClick={submitApplication}
                    >
                      Sign in to Apply Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

