import { Building2, MapPin, Clock, Briefcase, GraduationCap, Bookmark, BookmarkCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
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

  // Application form state
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeLink, setResumeLink] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState(null);
  const [applySuccess, setApplySuccess] = useState(null);
  const [applied, setApplied] = useState(false); // set true after success

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

  const toggleSave = async () => {
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
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const skills = job?.tags || [];
  const responsibilities = job?.responsibilities || [];
  const qualifications = job?.qualifications || [];

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

  const submitApplication = async () => {
    setApplyError(null);
    setApplySuccess(null);

    // Minimal validation: require job id (present) and either resume file or resume link or cover letter
    if (!id) {
      setApplyError("Job ID missing.");
      return;
    }
    if (!resumeFile && !resumeLink && !coverLetter) {
      setApplyError("Please attach a resume or provide a resume link or a cover letter.");
      return;
    }

    try {
      setApplying(true);

      const formData = new FormData();
      formData.append("job_id", id);
      if (coverLetter) formData.append("cover_letter", coverLetter);
      // optional: send applicant name/email (backend can ignore if not stored)
      if (applicantName) formData.append("applicant_name", applicantName);
      if (applicantEmail) formData.append("applicant_email", applicantEmail);
      if (resumeFile) formData.append("resume", resumeFile);
      if (!resumeFile && resumeLink) formData.append("resume_link", resumeLink);

      const res = await api.post("/jobs/apply", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data && res.data.ok) {
        setApplySuccess("Application submitted successfully.");
        setApplied(true);
        // optionally clear form
        setCoverLetter("");
        setResumeFile(null);
        setResumeLink("");
        // you can navigate the user to their applications page if you have one:
        // navigate('/my-applications');
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
  if (loading) return <div className="p-6">Loading job...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!job) return <div className="p-6">Job not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="mb-3 text-sm text-slate-600">
          <a href="/jobs" className="hover:underline">Jobs</a> / <span>{job.title}</span>
        </div>
        <h1 className="text-3xl font-extrabold">{job.title}</h1>
        <p className="mt-1 text-slate-600 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1"><Building2 size={16}/> {job.company}</span>
          <span className="inline-flex items-center gap-1"><MapPin size={16}/> {job.location}</span>
          <span className="inline-flex items-center gap-1 text-xs border rounded-full px-3 py-1"><Clock size={14}/> {job.type}</span>
          <span className="inline-flex items-center gap-1 text-xs border rounded-full px-3 py-1"><Briefcase size={14}/> {job.type}</span>
          <span className="inline-flex items-center gap-1 text-xs border rounded-full px-3 py-1"><GraduationCap size={14}/> {job.experiance}</span>
        </p>

        <Card className="mt-6 rounded-2xl">
          <CardHeader><CardTitle>About the role</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>{job.description}</p>
            <div>
              <p className="font-semibold mb-1">Responsibilities</p>
              <ul className="list-disc pl-5 space-y-1">
                {responsibilities.length ? responsibilities.map((r) => <li key={r}>{r}</li>) : <li>Responsibilities not provided</li>}
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-1">Qualifications</p>
              <ul className="list-disc pl-5 space-y-1">
                {qualifications.length ? qualifications.map((q) => <li key={q}>{q}</li>) : <li>Qualifications not provided</li>}
              </ul>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => <Badge key={s} variant="outline" className="rounded-full">{s}</Badge>)}
            </div>
          </CardContent>
        </Card>
      </div>

      <aside>
        <Card className="sticky top-24 rounded-2xl">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Apply to this job
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleSave}
                className="flex items-center gap-1"
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck size={16} className="text-blue-500" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark size={16} />
                    Save
                  </>
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Compensation</span><span className="font-semibold">{job.salary || 'NA'}</span></div>
              <div className="flex justify-between"><span>Work Mode</span><span className="font-semibold">{job.type}</span></div>
              <div className="flex justify-between"><span>Experience</span><span className="font-semibold">{job.experiance}</span></div>
            </div>

            <div className="mt-4 space-y-3">
              {/* applicant name/email are optional; backend typically sets user from token */}
              <Input placeholder="Your name (optional)" value={applicantName} onChange={(e) => setApplicantName(e.target.value)} />
              <Input placeholder="Email (optional)" value={applicantEmail} onChange={(e) => setApplicantEmail(e.target.value)} />

              <div>
                <label className="block text-sm mb-1">Resume (PDF / DOC / DOCX)</label>
                <input type="file" accept=".pdf,.doc,.docx" onChange={onFileChange} />
                {resumeFile && <div className="text-xs mt-1">{resumeFile.name}</div>}
              </div>

              <Input placeholder="Or paste a resume link" value={resumeLink} onChange={(e) => setResumeLink(e.target.value)} />

              <div>
                <label className="block text-sm mb-1">Cover letter (optional)</label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full rounded border p-2 text-sm"
                />
              </div>

              {applyError && <div className="text-red-600 text-sm">{applyError}</div>}
              {applySuccess && <div className="text-green-700 text-sm">{applySuccess}</div>}

              <div className="flex gap-2">
                <Button className="w-full" onClick={submitApplication} disabled={applying || applied}>
                  {applied ? "Applied" : applying ? "Applying..." : "Quick Apply"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}