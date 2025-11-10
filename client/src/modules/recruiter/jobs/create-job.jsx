import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

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

  function updateField(name, value) {
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  }

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
    // optional: check numeric fields
    if (form.vacancies <= 0) err.vacancies = "Vacancies must be >= 1";
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess(null);
    if (!validate()) return;

    setSubmitting(true);

    try {
      // Create formData for file upload
      const payload = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "logoFile") {
          if (v) payload.append("logo", v);
        } else {
          payload.append(k, v ?? "");
        }
      });

      // TODO: replace with your API path & headers
      const res = await fetch("/api/admin/jobs", {
        method: "POST",
        body: payload,
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.message || "Failed to create job");
      }

      setSuccess("Job posted successfully.");
      // clear form or navigate to job list
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
    } catch (err) {
      setSuccess(null);
      setErrors((e) => ({ ...e, submit: err.message || "Submit failed" }));
    } finally {
      setSubmitting(false);
    }
  }

  // small helper: display a logo preview (client-side)
  const logoPreview = form.logoFile ? URL.createObjectURL(form.logoFile) : null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Post a Job</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form column */}
        <div className="lg:col-span-2">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Create Job Posting</CardTitle>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="p-6 space-y-4">
                {success && <div className="rounded-md bg-emerald-50 p-3 text-emerald-700">{success}</div>}
                {errors.submit && <div className="rounded-md bg-red-50 p-3 text-red-700">{errors.submit}</div>}

                <div>
                  <label className="block text-sm font-medium mb-1">Job Title *</label>
                  <Input value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="e.g., Frontend Developer" />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Company *</label>
                    <Input value={form.company} onChange={(e) => updateField("company", e.target.value)} placeholder="Company name" />
                    {errors.company && <p className="text-xs text-red-500 mt-1">{errors.company}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Job Type</label>
                    <select value={form.jobType} onChange={(e) => updateField("jobType", e.target.value)} className="rounded-xl border p-3 w-full text-sm">
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
                    <Input value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="City" />
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Locality</label>
                    <Input value={form.locality} onChange={(e) => updateField("locality", e.target.value)} placeholder="Locality / area" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Vacancies</label>
                    <Input type="number" value={form.vacancies} onChange={(e) => updateField("vacancies", Math.max(1, Number(e.target.value || 1)))} />
                    {errors.vacancies && <p className="text-xs text-red-500 mt-1">{errors.vacancies}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Experience (min)</label>
                    <Input value={form.minExperience} onChange={(e) => updateField("minExperience", e.target.value)} placeholder="e.g., 0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Experience (max)</label>
                    <Input value={form.maxExperience} onChange={(e) => updateField("maxExperience", e.target.value)} placeholder="e.g., 3" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Salary</label>
                    <Input value={form.salary} onChange={(e) => updateField("salary", e.target.value)} placeholder="e.g., 3 LPA" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Skills / Technologies (comma separated)</label>
                  <Input value={form.skills} onChange={(e) => updateField("skills", e.target.value)} placeholder="React, Node.js, SQL, Docker" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Job Description *</label>
                  <textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} className="w-full rounded-xl border p-3 text-sm min-h-[140px]" placeholder="Describe responsibilities, requirements, benefits..." />
                  {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Interview Address / Office Address</label>
                  <Input value={form.interviewAddress} onChange={(e) => updateField("interviewAddress", e.target.value)} placeholder="Full address" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Email</label>
                    <Input value={form.contactEmail} onChange={(e) => updateField("contactEmail", e.target.value)} placeholder="hr@company.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Phone</label>
                    <Input value={form.contactPhone} onChange={(e) => updateField("contactPhone", e.target.value)} placeholder="+91 98xxxxxxxx" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Company / Job Logo</label>
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="text-sm" />
                  {logoPreview && <img src={logoPreview} alt="logo" className="mt-3 h-16 w-16 object-contain rounded-md border" />}
                </div>

                <div className="flex items-center justify-end gap-3 mt-4">
                  <Button variant="ghost" onClick={() => {
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
                  }}>Reset</Button>

                  <Button type="submit" className="rounded-full px-6 py-2" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "Publishing..." : "Publish Job"}
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>

        {/* Preview column */}
        <div>
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Preview</CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                {logoPreview ? (
                  <img src={logoPreview} alt="logo" className="h-16 w-16 object-cover rounded-md border" />
                ) : (
                  <div className="h-16 w-16 rounded-md bg-slate-100 grid place-items-center text-slate-400">Logo</div>
                )}
                <div>
                  <div className="font-semibold text-lg">{form.title || "Job title preview"}</div>
                  <div className="text-sm text-slate-600">{form.company || "Company name"}</div>
                </div>
              </div>

              <div className="text-sm text-slate-600">
                <div><strong>Location:</strong> {form.city || "City"} {form.locality ? `— ${form.locality}` : ""}</div>
                <div><strong>Type:</strong> {form.jobType}</div>
                <div><strong>Experience:</strong> {(form.minExperience || "0") + (form.maxExperience ? ` - ${form.maxExperience} yrs` : " yrs")}</div>
                <div><strong>Salary:</strong> {form.salary || "NA"}</div>
                <div className="mt-2"><strong>Skills:</strong> {form.skills || "—"}</div>
              </div>

              <div className="text-sm mt-2">
                <div className="font-medium">Short description</div>
                <div className="text-slate-600 text-sm">{form.description ? (form.description.length > 220 ? form.description.slice(0, 220) + "..." : form.description) : "Job description will appear here."}</div>
              </div>

              <div className="pt-3 border-t">
                <div className="text-xs text-slate-500">Contact</div>
                <div className="text-sm">{form.contactEmail || form.contactPhone || "No contact provided"}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
