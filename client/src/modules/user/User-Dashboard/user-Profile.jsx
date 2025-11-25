import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

/**
 * Updated Profile form to match this schema:
 * {
 *   "user_id": 0,
 *   "full_name": "string",
 *   "phone": "string",
 *   "city": "string",
 *   "state": "string",
 *   "country": "string",
 *   "experience_years": 0,
 *   "highest_education": "string",
 *   "resume_path": "string",
 *   "linkedin_url": "string",
 *   "portfolio_url": "string"
 * }
 *
 * Notes:
 * - resumeFile is kept as a File object for upload; resume_path stores the filename (or URL returned from backend).
 * - onFinish builds a payload using the schema keys.
 * - Replace the fake upload / fetch parts with your real API endpoints.
 */

export default function Profile() {
  const [step, setStep] = useState(1);

  // form state mapped to the schema fields (plus resumeFile for upload)
  const [form, setForm] = useState({
    user_id: null,
    full_name: "",
    phone: "",
    city: "",
    state: "",
    country: "",
    experience_years: "", // keep as string input, convert to number on submit
    highest_education: "",
    resumeFile: null, // actual File object (not part of schema; used for upload)
    resume_path: "", // schema field (file name or URL after upload)
    linkedin_url: "",
    portfolio_url: "",
  });

  const [errors, setErrors] = useState({});

  // helper to update fields
  function updateField(name, value) {
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  }

  // tracked fields for completion percent
  const trackedFields = [
    "full_name",
    "phone",
    "city",
    "state",
    "country",
    "experience_years",
    "highest_education",
    "resume_path",
    "linkedin_url",
    "portfolio_url",
  ];

  const completion = useMemo(() => {
    const total = trackedFields.length;
    let done = 0;
    for (const k of trackedFields) {
      const v = form[k];
      if (typeof v === "string") {
        if (v.trim() !== "") done += 1;
      } else if (v !== null && v !== undefined) {
        done += 1;
      }
    }
    return Math.round((done / total) * 100);
  }, [form]);

  // validation per step
  function validateStep(currentStep) {
    const newErrors = {};
    if (currentStep === 1) {
      if (!form.full_name.trim()) newErrors.full_name = "Enter full name";
      if (!form.phone.trim()) newErrors.phone = "Enter phone number";
    } else if (currentStep === 2) {
      if (!form.city.trim()) newErrors.city = "Enter city";
      if (!form.state.trim()) newErrors.state = "Enter state";
      if (!form.country.trim()) newErrors.country = "Enter country";
      if (!form.highest_education.trim()) newErrors.highest_education = "Select highest education";
    } else if (currentStep === 3) {
      // Experience/links: ensure numeric experience_years (optional but validated if provided)
      if (form.experience_years && isNaN(Number(form.experience_years))) {
        newErrors.experience_years = "Enter a valid number of years (e.g., 2)";
      }
      // linkedin & portfolio are optional, but if provided do a simple pattern check
      if (form.linkedin_url && !/^https?:\/\//i.test(form.linkedin_url)) {
        newErrors.linkedin_url = "Use full URL (include https://)";
      }
      if (form.portfolio_url && !/^https?:\/\//i.test(form.portfolio_url)) {
        newErrors.portfolio_url = "Use full URL (include https://)";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function onNext() {
    if (!validateStep(step)) return;
    if (step < 3) setStep((s) => s + 1);
  }
  function onBack() {
    if (step > 1) setStep((s) => s - 1);
  }

  // handle resume selection
  function onResumeFileChange(e) {
    const file = e.target.files?.[0] ?? null;
    updateField("resumeFile", file);
    // set resume_path to filename as placeholder; ideally, on upload your backend returns a URL which you should save.
    updateField("resume_path", file ? file.name : "");
  }

  // Simulated upload function (replace with actual upload API)
  async function uploadResume(file) {
    if (!file) return "";
    // Example: implement actual upload here; for now return filename after a short "fake" delay
    // IMPORTANT: Replace this simulated behavior with real upload code.
    return new Promise((resolve) => {
      setTimeout(() => resolve(file.name), 400); // returns filename as "path"
    });
  }

  async function onFinish() {
    // validate all steps
    let ok = true;
    for (let s = 1; s <= 3; s++) {
      if (!validateStep(s)) ok = false;
    }
    if (!ok) {
      for (let s = 1; s <= 3; s++) {
        const tmp = {};
        if (s === 1) {
          if (!form.full_name.trim()) tmp.full_name = true;
          if (!form.phone.trim()) tmp.phone = true;
        } else if (s === 2) {
          if (!form.city.trim()) tmp.city = true;
          if (!form.state.trim()) tmp.state = true;
          if (!form.country.trim()) tmp.country = true;
          if (!form.highest_education.trim()) tmp.highest_education = true;
        } else if (s === 3) {
          if (form.experience_years && isNaN(Number(form.experience_years))) tmp.experience_years = true;
        }
        if (Object.keys(tmp).length > 0) {
          setStep(s);
          break;
        }
      }
      return;
    }

    // If a resume file is present, upload it first (replace with your API)
    let resumePath = form.resume_path;
    if (form.resumeFile) {
      try {
        resumePath = await uploadResume(form.resumeFile);
        // set returned path into state (if backend returns a URL, set that)
        updateField("resume_path", resumePath);
      } catch (err) {
        // handle upload failure
        setErrors((e) => ({ ...e, resumeFile: "Failed to upload resume" }));
        return;
      }
    }

    // build payload matching the schema exactly
    const payload = {
      user_id: form.user_id ?? 0, // or null depending on your backend
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      country: form.country.trim(),
      experience_years: form.experience_years === "" ? 0 : Number(form.experience_years),
      highest_education: form.highest_education.trim(),
      resume_path: resumePath || "",
      linkedin_url: form.linkedin_url.trim(),
      portfolio_url: form.portfolio_url.trim(),
    };

    // Submit to backend (example)
    // Replace the fetch URL and method according to your API.
    /*
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      // handle success (e.g., navigate, toast)
    } catch (err) {
      // handle error (show toast or setErrors)
    }
    */

    // For demo: log payload and show alert
    // Remove alert in production
    console.log("Submitting payload:", payload);
    alert("Profile saved — payload printed to console.");
  }

  const stepTitles = ["Basics", "Location & Education", "Experience & Links"];
  const percent = completion >= 100 ? 100 : completion;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">Create / Update Profile</h1>
          <div className="text-sm text-slate-700">
            Profile completion: <span className="font-semibold text-emerald-600">{percent}%</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => {
            const segmentIndex = i + 1;
            const filled = step > segmentIndex || (step === segmentIndex && percent >= (segmentIndex - 1) * Math.round(100 / 3) + 1);
            return (
              <div key={i} className="h-2 rounded-full w-full bg-slate-200 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-300`}
                  style={{
                    width: `${Math.min(Math.max((percent - (segmentIndex - 1) * (100 / 3)) / (100 / 3) * 100, 0), 100)}%`,
                    background: filled ? "linear-gradient(90deg,#0ea5a4,#34d399)" : "#dbeafe",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="rounded-2xl p-4">
            <CardHeader>
              <CardTitle className="text-lg">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {stepTitles.map((t, idx) => {
                  const idx1 = idx + 1;
                  return (
                    <li key={t} className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full grid place-items-center text-sm font-medium ${step === idx1 ? "bg-emerald-600 text-white" : step > idx1 ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
                          }`}
                      >
                        {idx1}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{t}</div>
                        <div className="text-xs text-slate-500">
                          {idx1 === step ? "In progress" : idx1 < step ? "Completed" : "Pending"}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {percent >= 100 ? (
                <div className="mt-6 rounded-lg bg-emerald-50 border border-emerald-100 p-4 text-emerald-700">
                  Your profile looks complete
                </div>
              ) : (
                <div className="mt-6 rounded-lg bg-slate-50 border border-slate-100 p-4 text-slate-700">
                  Complete all steps to reach 100%
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl">{stepTitles[step - 1]}</CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              {/* Step 1 - Basics */}
              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full name</label>
                    <Input value={form.full_name} onChange={(e) => updateField("full_name", e.target.value)} placeholder="Full name" />
                    {errors.full_name && <p className="text-xs text-red-500 mt-1">{errors.full_name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <Input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="Phone number" />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Highest education</label>
                    <select value={form.highest_education} onChange={(e) => updateField("highest_education", e.target.value)} className="rounded-xl border p-3 w-full text-sm">
                      <option value="">Select</option>
                      <option>Below 10th</option>
                      <option>10th Pass</option>
                      <option>12th Pass</option>
                      <option>Diploma</option>
                      <option>Graduate</option>
                      <option>Post Graduate</option>
                    </select>
                    {errors.highest_education && <p className="text-xs text-red-500 mt-1">{errors.highest_education}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Experience (years)</label>
                    <Input value={form.experience_years} onChange={(e) => updateField("experience_years", e.target.value)} placeholder="e.g., 2" />
                    {errors.experience_years && <p className="text-xs text-red-500 mt-1">{errors.experience_years}</p>}
                  </div>
                </div>
              )}

              {/* Step 2 - Location & Resume */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">City</label>
                      <Input value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="City" />
                      {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">State</label>
                      <Input value={form.state} onChange={(e) => updateField("state", e.target.value)} placeholder="State" />
                      {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Country</label>
                      <Input value={form.country} onChange={(e) => updateField("country", e.target.value)} placeholder="Country" />
                      {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Upload resume (pdf/doc)</label>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={onResumeFileChange} className="block w-full text-sm" />
                    {form.resume_path && <p className="text-xs text-slate-600 mt-1">Resume: {form.resume_path}</p>}
                    {errors.resumeFile && <p className="text-xs text-red-500 mt-1">{errors.resumeFile}</p>}
                  </div>
                </div>
              )}

              {/* Step 3 - Links & Finish */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">LinkedIn URL</label>
                    <Input value={form.linkedin_url} onChange={(e) => updateField("linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/yourname" />
                    {errors.linkedin_url && <p className="text-xs text-red-500 mt-1">{errors.linkedin_url}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Portfolio / Website</label>
                    <Input value={form.portfolio_url} onChange={(e) => updateField("portfolio_url", e.target.value)} placeholder="https://your-portfolio.com" />
                    {errors.portfolio_url && <p className="text-xs text-red-500 mt-1">{errors.portfolio_url}</p>}
                  </div>

                  <div className="text-sm text-slate-500">
                    When you click <strong>Save & Finish</strong>, the component constructs a payload that matches your schema and (optionally) uploads the resume file first.
                  </div>
                </div>
              )}

              {/* actions */}
              <div className="mt-6 flex items-center justify-between gap-4">
                <div>
                  <Button variant="ghost" onClick={onBack} className="mr-2" disabled={step === 1}>
                    Back
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  {step < 3 ? (
                    <Button className="rounded-full py-2 px-6" onClick={onNext}>
                      Next &raquo;
                    </Button>
                  ) : (
                    <Button className="rounded-full py-2 px-6" onClick={onFinish}>
                      Save & Finish
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
