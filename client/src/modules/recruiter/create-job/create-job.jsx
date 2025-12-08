import { useState } from "react";
import api from "../../../components/apiconfig/apiconfig";
// Component for creating a new job posting
export default function AdminPostJob() {
  const [form, setForm] = useState({
    title: "",
    company: "",
    jobType: "Full-time",
    city: "",
    locality: "",
    skills: "",
    minExperience: "",
    maxExperience: "",
    salary: "",
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
      payload.append("city", form.city);
      payload.append("locality", form.locality);
      payload.append("skills", form.skills);
      payload.append("minExperience", form.minExperience);
      payload.append("maxExperience", form.maxExperience);
      payload.append("salary", form.salary);
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
        city: "",
        locality: "",
        skills: "",
        minExperience: "",
        maxExperience: "",
        salary: "",
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
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Post a Job</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form column */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Create Job Posting</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                {success && <div className="rounded-md bg-emerald-50 p-3 text-emerald-700">{success}</div>}
                {errors.submit && <div className="rounded-md bg-red-50 p-3 text-red-700">{errors.submit}</div>}

                <div>
                  <label className="block text-sm font-medium mb-1">Job Title *</label>
                  <input
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="e.g., Frontend Developer"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none"
                  />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Company *</label>
                    <input
                      value={form.company}
                      onChange={(e) => updateField("company", e.target.value)}
                      placeholder="Company name"
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none"
                    />
                    {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Job Type</label>
                    <select
                      value={form.jobType}
                      onChange={(e) => updateField("jobType", e.target.value)}
                      className="rounded-xl border p-3 w-full text-sm"
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                      <option>Work from Home</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City *</label>
                    <input value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="City" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none" />
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Locality</label>
                    <input value={form.locality} onChange={(e) => updateField("locality", e.target.value)} placeholder="Locality / area" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Vacancies</label>
                    <input
                      type="number"
                      value={form.vacancies}
                      onChange={(e) => updateField("vacancies", Math.max(1, Number(e.target.value || 1)))}
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none"
                    />
                    {errors.vacancies && <p className="text-xs text-red-500 mt-1">{errors.vacancies}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Experience (min)</label>
                    <input value={form.minExperience} onChange={(e) => updateField("minExperience", e.target.value)} placeholder="e.g., 0" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Experience (max)</label>
                    <input value={form.maxExperience} onChange={(e) => updateField("maxExperience", e.target.value)} placeholder="e.g., 3" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Salary</label>
                    <input value={form.salary} onChange={(e) => updateField("salary", e.target.value)} placeholder="e.g., 3 LPA" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Skills / Technologies (comma separated)</label>
                  <input value={form.skills} onChange={(e) => updateField("skills", e.target.value)} placeholder="React, Node.js, SQL, Docker" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Job Description *</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    className="w-full rounded-xl border p-3 text-sm min-h-[140px]"
                    placeholder="Describe responsibilities, requirements, benefits..."
                  />
                  {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Interview Address / Office Address</label>
                  <input value={form.interviewAddress} onChange={(e) => updateField("interviewAddress", e.target.value)} placeholder="Full address" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Email</label>
                    <input value={form.contactEmail} onChange={(e) => updateField("contactEmail", e.target.value)} placeholder="hr@company.com" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Phone</label>
                    <input value={form.contactPhone} onChange={(e) => updateField("contactPhone", e.target.value)} placeholder="+91 98xxxxxxxx" className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Company / Job Logo</label>
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="text-sm" />
                  {logoPreview && <img src={logoPreview} alt="logo" className="mt-3 h-16 w-16 object-contain rounded-md border" />}
                </div>

                <div className="flex items-center justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      // reset
                      setForm({
                        title: "",
                        company: "",
                        jobType: "Full-time",
                        city: "",
                        locality: "",
                        skills: "",
                        minExperience: "",
                        maxExperience: "",
                        salary: "",
                        vacancies: 1,
                        description: "",
                        interviewAddress: "",
                        contactEmail: "",
                        contactPhone: "",
                        logoFile: null,
                      });
                      setErrors({});
                      setSuccess(null);
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Reset
                  </button>

                  <button type="submit" className="rounded-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={submitting}>
                    {submitting ? "Publishing..." : "Publish Job"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Preview column */}
        <div>
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-base font-semibold">Preview</h2>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                {logoPreview ? (
                  <img src={logoPreview} alt="logo" className="h-16 w-16 object-cover rounded-md border" />
                ) : (
                  <div className="h-16 w-16 rounded-md bg-slate-100 grid place-items-center text-slate-400">Logo</div>
                )}
                <div>
                  <div className="font-semibold text-lg">{previewTitle || "Job title preview"}</div>
                  <div className="text-sm text-slate-600">{previewCompany || "Company name"}</div>
                </div>
              </div>

              <div className="text-sm text-slate-600">
                <div>
                  <strong>Location:</strong> {form.city || "City"} {form.locality ? `— ${form.locality}` : ""}
                </div>
                <div>
                  <strong>Type:</strong> {form.jobType}
                </div>
                <div>
                  <strong>Experience:</strong> {(form.minExperience || "0") + (form.maxExperience ? ` - ${form.maxExperience} yrs` : " yrs")}
                </div>
                <div>
                  <strong>Salary:</strong> {form.salary || "NA"}
                </div>
                <div className="mt-2">
                  <strong>Skills:</strong> {form.skills || "—"}
                </div>
              </div>

              <div className="text-sm mt-2">
                <div className="font-medium">Short description</div>
                <div className="text-slate-600 text-sm">
                  {form.description ? (form.description.length > 220 ? form.description.slice(0, 220) + "..." : form.description) : "Job description will appear here."}
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="text-xs text-slate-500">Contact</div>
                <div className="text-sm">{form.contactEmail || form.contactPhone || "No contact provided"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}