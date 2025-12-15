import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../components/apiconfig/apiconfig";
// Component for creating a new job posting
export default function AdminPostJob() {
  const [form, setForm] = useState({
    title: "",
    company: "",
    jobType: "Full-time",
    workMode: "Office",
    city: "",
    locality: "",
    skills: "",
    minExperience: "",
    maxExperience: "",
    minSalary: "",
    maxSalary: "",
    vacancies: 1,
    description: "",
    interviewAddress: "",
    contactEmail: "",
    contactPhone: "",
    logoFile: null,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  // Update form field
  function updateField(name, value) {
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  }
  // Handle logo file change
  function handleLogoChange(e) {
    const file = e.target.files?.[0] ?? null;
    updateField("logoFile", file);
  }

  function validate() {
    const err = {};
    if (!form.title.trim()) err.title = "Job title is required";
    if (!form.company.trim()) err.company = "Company name is required";
    if (!form.city.trim()) err.city = "City required";
    if (!form.description.trim()) err.description = "Job description required";
    if (!form.contactEmail.trim() && !form.contactPhone.trim()) err.contact = "Provide email or phone";
    if (form.vacancies <= 0) err.vacancies = "Vacancies must be >= 1";
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  // Helper: capitalize first character and lowercase the rest
  function capitalizeFirst(str) {
    if (!str && str !== "") return "";
    const s = String(str).trim();
    if (!s) return "";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess(null);

    if (!termsAccepted) {
      setErrors((e) => ({ ...e, submit: "Please confirm that this is a genuine job opening and accept the Terms & Conditions." }));
      return;
    }

    if (!validate()) return;

    setSubmitting(true);

    try {
      // normalize title + company before sending
      const normalizedTitle = capitalizeFirst(form.title);
      const normalizedCompany = capitalizeFirst(form.company);

      // Create formData for file upload
      const payload = new FormData();

      // Append all form fields
      payload.append("title", normalizedTitle);
      payload.append("company", normalizedCompany);
      payload.append("jobType", form.jobType);
      payload.append("workMode", form.workMode);
      payload.append("city", form.city);
      payload.append("locality", form.locality);
      payload.append("skills", form.skills);
      payload.append("minExperience", form.minExperience);
      payload.append("maxExperience", form.maxExperience);
      payload.append("minSalary", form.minSalary);
      payload.append("maxSalary", form.maxSalary);
      payload.append("vacancies", form.vacancies.toString());
      payload.append("description", form.description);
      payload.append("interviewAddress", form.interviewAddress);
      payload.append("contactEmail", form.contactEmail);
      payload.append("contactPhone", form.contactPhone);

      if (form.logoFile) {
        payload.append("logo", form.logoFile);
      }

      // send to backend using axios instance
      const { data } = await api.post("/recruiter/jobs/create", payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(data?.message || "Job posted successfully.");

      // clear form
      setForm({
        title: "",
        company: "",
        jobType: "Full-time",
        workMode: "Office",
        city: "",
        locality: "",
        skills: "",
        minExperience: "",
        maxExperience: "",
        minSalary: "",
        maxSalary: "",
        vacancies: 1,
        description: "",
        interviewAddress: "",
        contactEmail: "",
        contactPhone: "",
        logoFile: null,
      });
      setErrors({});
    } catch (err) {
      setSuccess(null);
      const errorMessage = err?.response?.data?.message || err.message || "Submit failed";
      setErrors((e) => ({ ...e, submit: errorMessage }));
      console.error("Job creation error:", err);
    } finally {
      setSubmitting(false);
    }
  }

  // small helper: display a logo preview (client-side)
  const logoPreview = form.logoFile ? URL.createObjectURL(form.logoFile) : null;

  // For preview only: show capitalized-first display (does not modify form state)
  const previewTitle = form.title ? capitalizeFirst(form.title) : "";
  const previewCompany = form.company ? capitalizeFirst(form.company) : "";

  return (
    <div className="container-custom py-8 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-text-dark">Post a Job</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Form column */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="p-4 sm:p-6 border-b border-border">
              <h2 className="text-lg sm:text-xl font-semibold text-text-dark">Create Job Posting</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                {success && (
                  <div className="rounded-lg bg-success-light border border-success-300 p-3 sm:p-4 text-success-700 text-sm">
                    {success}
                  </div>
                )}
                {errors.submit && (
                  <div className="rounded-lg bg-error-light border border-error-300 p-3 sm:p-4 text-error-700 text-sm">
                    {errors.submit}
                  </div>
                )}

                <div>
                  <label className="label">Job Title *</label>
                  <input
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="e.g., Frontend Developer"
                    className={`input ${errors.title ? 'input-error' : ''}`}
                  />
                  {errors.title && <p className="text-xs text-error-600 mt-1.5">{errors.title}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="label">Company *</label>
                    <input
                      value={form.company}
                      onChange={(e) => updateField("company", e.target.value)}
                      placeholder="Company name"
                      className={`input ${errors.company ? 'input-error' : ''}`}
                    />
                    {errors.company && <p className="text-xs text-error-600 mt-1.5">{errors.company}</p>}
                  </div>

                  <div>
                    <label className="label">Job Type</label>
                    <select
                      value={form.jobType}
                      onChange={(e) => updateField("jobType", e.target.value)}
                      className="select"
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                      <option>Work from Home</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Work Mode</label>
                    <select
                      value={form.workMode}
                      onChange={(e) => updateField("workMode", e.target.value)}
                      className="select"
                    >
                      <option>Office</option>
                      <option>Remote</option>
                      <option>Hybrid</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="label">City *</label>
                    <input
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      placeholder="City"
                      className={`input ${errors.city ? 'input-error' : ''}`}
                    />
                    {errors.city && <p className="text-xs text-error-600 mt-1.5">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="label">Locality</label>
                    <input
                      value={form.locality}
                      onChange={(e) => updateField("locality", e.target.value)}
                      placeholder="Locality / area"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Vacancies</label>
                    <input
                      type="number"
                      value={form.vacancies}
                      onChange={(e) => updateField("vacancies", Math.max(1, Number(e.target.value || 1)))}
                      className={`input ${errors.vacancies ? 'input-error' : ''}`}
                    />
                    {errors.vacancies && <p className="text-xs text-error-600 mt-1.5">{errors.vacancies}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Experience (min)</label>
                      <input
                        value={form.minExperience}
                        onChange={(e) => updateField("minExperience", e.target.value)}
                        placeholder="e.g., 0"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Experience (max)</label>
                      <input
                        value={form.maxExperience}
                        onChange={(e) => updateField("maxExperience", e.target.value)}
                        placeholder="e.g., 3"
                        className="input"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Salary (min) /Month</label>
                      <input
                        type="number"
                        value={form.minSalary}
                        onChange={(e) => updateField("minSalary", e.target.value)}
                        placeholder="e.g., 20000"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">Salary (max) /Month</label>
                      <input
                        type="number"
                        value={form.maxSalary}
                        onChange={(e) => updateField("maxSalary", e.target.value)}
                        placeholder="e.g., 40000"
                        className="input"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="label">Skills / Technologies (comma separated)</label>
                  <input
                    value={form.skills}
                    onChange={(e) => updateField("skills", e.target.value)}
                    placeholder="React, Node.js, SQL, Docker"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">Job Description *</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className={`textarea ${errors.description ? 'input-error' : ''}`}
                    placeholder="Describe responsibilities, requirements, benefits..."
                  />
                  {errors.description && <p className="text-xs text-error-600 mt-1.5">{errors.description}</p>}
                </div>

                <div>
                  <label className="label">Interview Address / Office Address</label>
                  <input
                    value={form.interviewAddress}
                    onChange={(e) => updateField("interviewAddress", e.target.value)}
                    placeholder="Full address"
                    className="input"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Contact Email</label>
                    <input
                      value={form.contactEmail}
                      onChange={(e) => updateField("contactEmail", e.target.value)}
                      placeholder="hr@company.com"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Contact Phone</label>
                    <input
                      value={form.contactPhone}
                      onChange={(e) => updateField("contactPhone", e.target.value)}
                      placeholder="+91 98xxxxxxxx"
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Company / Job Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-button file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
                  />
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="logo preview"
                      className="mt-3 h-20 w-20 object-contain rounded-lg border border-border"
                    />
                  )}
                </div>

                {/* Terms & Conditions Acceptance */}
                <div className="p-4 sm:p-5 bg-gray-50 rounded-lg border border-border">
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="terms-checkbox-job"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 h-4 w-4 text-primary-600 focus:ring-primary-500 border-border rounded cursor-pointer"
                      required
                    />
                    <label htmlFor="terms-checkbox-job" className="text-sm text-text-dark cursor-pointer leading-relaxed">
                      I confirm this is a genuine job opening and I agree to HireSpark's{" "}
                      <Link to="/terms" target="_blank" className="text-primary-600 hover:text-primary-700 hover:underline font-medium">
                        job posting policies
                      </Link>.
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => {
                      // reset
                      setForm({
                        title: "",
                        company: "",
                        jobType: "Full-time",
                        workMode: "Office",
                        city: "",
                        locality: "",
                        skills: "",
                        minExperience: "",
                        maxExperience: "",
                        minSalary: "",
                        maxSalary: "",
                        vacancies: 1,
                        description: "",
                        interviewAddress: "",
                        contactEmail: "",
                        contactPhone: "",
                        logoFile: null,
                      });
                      setErrors({});
                      setSuccess(null);
                      setTermsAccepted(false);
                    }}
                    className="btn btn-outline btn-md sm:w-auto w-full"
                  >
                    Reset
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary btn-md sm:w-auto w-full"
                    disabled={submitting || !termsAccepted}
                  >
                    {submitting ? "Publishing..." : "Publish Job"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Preview column */}
        <div className="lg:sticky lg:top-4 lg:self-start">
          <div className="card">
            <div className="p-4 sm:p-5 border-b border-border">
              <h2 className="text-base sm:text-lg font-semibold text-text-dark">Preview</h2>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
              <div className="flex items-start gap-3">
                {logoPreview ? (
                  <img src={logoPreview} alt="logo preview" className="h-16 w-16 object-cover rounded-lg border border-border flex-shrink-0" />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-gray-100 grid place-items-center text-text-light text-xs border border-border flex-shrink-0">Logo</div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-base sm:text-lg text-text-dark">{previewTitle || "Job title preview"}</div>
                  <div className="text-sm text-text-muted mt-0.5">{previewCompany || "Company name"}</div>
                </div>
              </div>

              <div className="text-sm text-text-dark space-y-2">
                <div>
                  <strong className="text-text-muted">Location:</strong>{" "}
                  <span className="text-text-dark">{form.city || "City"}{form.locality ? ` — ${form.locality}` : ""}</span>
                </div>
                <div>
                  <strong className="text-text-muted">Type:</strong> <span className="text-text-dark">{form.jobType}</span>
                </div>
                <div>
                  <strong className="text-text-muted">Work Mode:</strong> <span className="text-text-dark">{form.workMode}</span>
                </div>
                <div>
                  <strong className="text-text-muted">Experience:</strong>{" "}
                  <span className="text-text-dark">{(form.minExperience || "0") + (form.maxExperience ? ` - ${form.maxExperience} yrs` : " yrs")}</span>
                </div>
                <div>
                  <strong className="text-text-muted">Salary:</strong>{" "}
                  <span className="text-text-dark">
                    {form.minSalary && form.maxSalary
                      ? `₹ ${Number(form.minSalary).toLocaleString('en-IN')} - ${Number(form.maxSalary).toLocaleString('en-IN')} /Month`
                      : form.minSalary
                        ? `₹ ${Number(form.minSalary).toLocaleString('en-IN')}+ /Month`
                        : form.maxSalary
                          ? `Up to ₹ ${Number(form.maxSalary).toLocaleString('en-IN')} /Month`
                          : "NA"}
                  </span>
                </div>
                <div className="mt-2">
                  <strong className="text-text-muted">Skills:</strong> <span className="text-text-dark">{form.skills || "—"}</span>
                </div>
              </div>

              <div className="text-sm pt-2 border-t border-border">
                <div className="font-medium text-text-dark mb-1.5">Short description</div>
                <div className="text-text-muted text-sm leading-relaxed">
                  {form.description ? (form.description.length > 220 ? form.description.slice(0, 220) + "..." : form.description) : "Job description will appear here."}
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <div className="text-xs text-text-muted mb-1">Contact</div>
                <div className="text-sm text-text-dark">{form.contactEmail || form.contactPhone || "No contact provided"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}