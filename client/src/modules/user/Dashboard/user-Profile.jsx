import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export default function Profile() {
  // Step: 1..4
  const [step, setStep] = useState(1);

  // form state
  const [form, setForm] = useState({
    // Step 1 - Basics
    fullName: "",
    mobile: "",
    email: "",
    gender: "",

    // Step 2 - Education
    highestQualification: "",
    college: "",
    passingYear: "",
    skills: "", // comma separated

    // Step 3 - Experience & Resume
    resumeFile: null, // File object
    experience: "", // text or years
    projects: "",

    // Step 4 - Job Preferences
    preferredCity: "",
    preferredLocality: "",
    workMode: "",
    salaryExpectation: "",
  });

  const [errors, setErrors] = useState({});

  // helper to update fields
  function updateField(name, value) {
    setForm((s) => ({ ...s, [name]: value }));
    // clear error for field
    setErrors((e) => ({ ...e, [name]: "" }));
  }

  // List of all tracked fields for percent calculation
  const trackedFields = [
    "fullName",
    "mobile",
    "email",
    "gender",
    "highestQualification",
    "college",
    "passingYear",
    "skills",
    "resumeFile",
    "experience",
    "projects",
    "preferredCity",
    "preferredLocality",
    "workMode",
    "salaryExpectation",
  ];

  // compute completion percent
  const completion = useMemo(() => {
    const total = trackedFields.length;
    let done = 0;
    for (const k of trackedFields) {
      const v = form[k];
      if (k === "resumeFile") {
        if (v) done += 1;
      } else if (typeof v === "string" && v.trim() !== "") {
        done += 1;
      }
    }
    // if user has visited and completed all 4 steps we can treat as 100%
    // but by default compute from fields
    return Math.round((done / total) * 100);
  }, [form]);

  // validation for each step
  function validateStep(currentStep) {
    const newErrors = {};
    if (currentStep === 1) {
      if (!form.fullName.trim()) newErrors.fullName = "Enter full name";
      if (!form.mobile.trim()) newErrors.mobile = "Enter mobile number";
      if (!form.email.trim()) newErrors.email = "Enter email";
      if (!form.gender.trim()) newErrors.gender = "Select gender";
    } else if (currentStep === 2) {
      if (!form.highestQualification.trim()) newErrors.highestQualification = "Select qualification";
      if (!form.college.trim()) newErrors.college = "Enter college/university";
      if (!form.passingYear.trim()) newErrors.passingYear = "Enter passing year";
      if (!form.skills.trim()) newErrors.skills = "Add at least one skill";
    } else if (currentStep === 3) {
      // resume optional but encourage
      // no hard validation here; you can require resumeFile if you want
      // if (!form.resumeFile) newErrors.resumeFile = "Upload resume";
      // experience/project optional
    } else if (currentStep === 4) {
      if (!form.preferredCity.trim()) newErrors.preferredCity = "Select preferred city";
      if (!form.workMode.trim()) newErrors.workMode = "Select work mode";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function onNext() {
    if (!validateStep(step)) return;
    if (step < 4) setStep((s) => s + 1);
  }
  function onBack() {
    if (step > 1) setStep((s) => s - 1);
  }

  function onFinish() {
    // run full validation across steps
    let ok = true;
    for (let s = 1; s <= 4; s++) {
      if (!validateStep(s)) ok = false;
    }
    if (!ok) {
      // jump to first invalid step
      for (let s = 1; s <= 4; s++) {
        const tmpErrors = {};
        if (s === 1) {
          if (!form.fullName.trim()) tmpErrors.fullName = true;
          if (!form.mobile.trim()) tmpErrors.mobile = true;
          if (!form.email.trim()) tmpErrors.email = true;
          if (!form.gender.trim()) tmpErrors.gender = true;
        } else if (s === 2) {
          if (!form.highestQualification.trim()) tmpErrors.highestQualification = true;
          if (!form.college.trim()) tmpErrors.college = true;
          if (!form.passingYear.trim()) tmpErrors.passingYear = true;
          if (!form.skills.trim()) tmpErrors.skills = true;
        } else if (s === 4) {
          if (!form.preferredCity.trim()) tmpErrors.preferredCity = true;
          if (!form.workMode.trim()) tmpErrors.workMode = true;
        }
        if (Object.keys(tmpErrors).length > 0) {
          setStep(s);
          break;
        }
      }
      return;
    }

    // final submit: here you would send form to backend
    // For demo, mark percent 100 (it already will be if all fields filled)
    alert("Profile saved — nice! Your profile is " + completion + "% complete.");
  }

  // shortcut to handle resume file selection
  function onResumeFileChange(e) {
    const file = e.target.files?.[0];
    updateField("resumeFile", file || null);
  }

  // UI for the left progress area
  const stepTitles = ["Basics", "Education", "Experience", "Job Preferences"];
  const percent = completion >= 100 ? 100 : completion;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Top progress & completion */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold">Make your profile</h1>
          <div className="text-sm text-slate-700">
            Profile completion:{" "}
            <span className="font-semibold text-emerald-600">{percent}%</span>
          </div>
        </div>

        {/* segmented progress bar */}
        <div className="mt-4 grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => {
            const segmentIndex = i + 1;
            const filled = step > segmentIndex || (step === segmentIndex && percent >= (segmentIndex - 1) * 25 + 1);
            return (
              <div key={i} className="h-2 rounded-full w-full bg-slate-200 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-300`}
                  style={{
                    width: `${Math.min(Math.max((percent - (segmentIndex - 1) * 25) / 25 * 100, 0), 100)}%`,
                    background: filled ? "linear-gradient(90deg,#0ea5a4,#34d399)" : "#dbeafe",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column: step indicator + summary */}
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
                        className={`w-8 h-8 rounded-full grid place-items-center text-sm font-medium ${
                          step === idx1 ? "bg-emerald-600 text-white" : step > idx1 ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
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

              {/* completion banner */}
              {percent >= 100 ? (
                <div className="mt-6 rounded-lg bg-emerald-50 border border-emerald-100 p-4 text-emerald-700">
                  🎉 Your profile is 100% updated
                </div>
              ) : (
                <div className="mt-6 rounded-lg bg-slate-50 border border-slate-100 p-4 text-slate-700">
                  Complete all steps to reach 100%
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column: form steps */}
        <div className="lg:col-span-2">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl">{stepTitles[step - 1]}</CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              {/* Step 1: Basics */}
              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <Input value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} placeholder="Enter full name" />
                    {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Mobile Number</label>
                    <Input value={form.mobile} onChange={(e) => updateField("mobile", e.target.value)} placeholder="Enter mobile number" />
                    {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="Enter email" />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    <div className="flex gap-3">
                      {["Male", "Female", "Other"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => updateField("gender", g)}
                          className={`px-3 py-1.5 rounded-full border text-sm ${form.gender === g ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-700 border-slate-200"}`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                    {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
                  </div>
                </div>
              )}

              {/* Step 2: Education */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Highest Qualification</label>
                    <select value={form.highestQualification} onChange={(e) => updateField("highestQualification", e.target.value)} className="rounded-xl border p-3 w-full text-sm">
                      <option value="">Select qualification</option>
                      <option>Below 10th</option>
                      <option>10th Pass</option>
                      <option>12th Pass</option>
                      <option>Diploma</option>
                      <option>Graduate</option>
                      <option>Post Graduate</option>
                    </select>
                    {errors.highestQualification && <p className="text-xs text-red-500 mt-1">{errors.highestQualification}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">College / University</label>
                      <Input value={form.college} onChange={(e) => updateField("college", e.target.value)} placeholder="Enter college or university" />
                      {errors.college && <p className="text-xs text-red-500 mt-1">{errors.college}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Passing Year</label>
                      <Input value={form.passingYear} onChange={(e) => updateField("passingYear", e.target.value)} placeholder="e.g., 2023" />
                      {errors.passingYear && <p className="text-xs text-red-500 mt-1">{errors.passingYear}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Skills / Technologies</label>
                    <Input value={form.skills} onChange={(e) => updateField("skills", e.target.value)} placeholder="Comma separated: React, Node.js, SQL" />
                    {errors.skills && <p className="text-xs text-red-500 mt-1">{errors.skills}</p>}
                  </div>
                </div>
              )}

              {/* Step 3: Resume & Experience */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Upload Resume</label>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={onResumeFileChange} className="block w-full text-sm" />
                    {form.resumeFile && <p className="text-xs text-slate-600 mt-1">Uploaded: {form.resumeFile.name}</p>}
                    {errors.resumeFile && <p className="text-xs text-red-500 mt-1">{errors.resumeFile}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Work Experience</label>
                    <Input value={form.experience} onChange={(e) => updateField("experience", e.target.value)} placeholder="Years or short description (e.g., 2 yrs in frontend)" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Projects / Key Achievements</label>
                    <textarea value={form.projects} onChange={(e) => updateField("projects", e.target.value)} className="w-full rounded-xl border p-3 text-sm min-h-[90px]" placeholder="Briefly list projects or achievements" />
                  </div>
                </div>
              )}

              {/* Step 4: Job Preferences */}
              {step === 4 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Which city do you want to work in?</label>
                    <Input value={form.preferredCity} onChange={(e) => updateField("preferredCity", e.target.value)} placeholder="Select City" />
                    {errors.preferredCity && <p className="text-xs text-red-500 mt-1">{errors.preferredCity}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Select Locality</label>
                    <Input value={form.preferredLocality} onChange={(e) => updateField("preferredLocality", e.target.value)} placeholder="Select Locality" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Work mode preference</label>
                    <div className="flex gap-3">
                      {["Remote", "Hybrid", "Office"].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => updateField("workMode", m)}
                          className={`px-3 py-1.5 rounded-full border text-sm ${form.workMode === m ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-700 border-slate-200"}`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                    {errors.workMode && <p className="text-xs text-red-500 mt-1">{errors.workMode}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Salary expectation</label>
                    <Input value={form.salaryExpectation} onChange={(e) => updateField("salaryExpectation", e.target.value)} placeholder="e.g., 3 LPA" />
                  </div>

                  <div className="flex items-center gap-3 mt-3 bg-slate-50 border border-slate-100 p-3 rounded-lg">
                    <input id="whatsapp" type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                    <label htmlFor="whatsapp" className="text-sm text-slate-700">Get me job updates on WhatsApp</label>
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
                  {step < 4 ? (
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
