import { Building2, MapPin, Clock, Briefcase, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { useParams } from "react-router-dom";

export default function JobDetail() {
  const { id } = useParams();
  const job = {
    id,
    title: "Junior Data Analyst",
    company: "QuantLeaf",
    loc: "Bengaluru, IN",
    mode: "Hybrid",
    type: "Full-time",
    exp: "0–2 yrs",
    ctc: "₹5–7 LPA",
    skills: ["SQL", "Excel", "Tableau", "Python"],
    about: "As a Junior Data Analyst at QuantLeaf, you will clean, analyze, and visualize datasets to help decisions.",
    responsibilities: ["Build dashboards", "Write queries", "Collaborate with engineering & ops"],
    qualifications: ["Student/Fresher or 0–2 yrs", "Good SQL/Excel", "Basic viz (Tableau/Power BI)"],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="mb-3 text-sm text-slate-600">
          <a href="/jobs" className="hover:underline">Jobs</a> / <span>{job.title}</span>
        </div>
        <h1 className="text-3xl font-extrabold">{job.title}</h1>
        <p className="mt-1 text-slate-600 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1"><Building2 size={16}/> {job.company}</span>
          <span className="inline-flex items-center gap-1"><MapPin size={16}/> {job.loc}</span>
          <span className="inline-flex items-center gap-1 text-xs border rounded-full px-3 py-1"><Clock size={14}/> {job.mode}</span>
          <span className="inline-flex items-center gap-1 text-xs border rounded-full px-3 py-1"><Briefcase size={14}/> {job.type}</span>
          <span className="inline-flex items-center gap-1 text-xs border rounded-full px-3 py-1"><GraduationCap size={14}/> {job.exp}</span>
        </p>

        <Card className="mt-6 rounded-2xl">
          <CardHeader><CardTitle>About the role</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-slate-700">
            <p>{job.about}</p>
            <div>
              <p className="font-semibold mb-1">Responsibilities</p>
              <ul className="list-disc pl-5 space-y-1">
                {job.responsibilities.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-1">Qualifications</p>
              <ul className="list-disc pl-5 space-y-1">
                {job.qualifications.map((q) => <li key={q}>{q}</li>)}
              </ul>
            </div>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s) => <Badge key={s} variant="outline" className="rounded-full">{s}</Badge>)}
            </div>
          </CardContent>
        </Card>
      </div>

      <aside>
        <Card className="sticky top-24 rounded-2xl">
          <CardHeader><CardTitle>Apply to this job</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Compensation</span><span className="font-semibold">{job.ctc}</span></div>
              <div className="flex justify-between"><span>Work Mode</span><span className="font-semibold">{job.mode}</span></div>
              <div className="flex justify-between"><span>Experience</span><span className="font-semibold">{job.exp}</span></div>
            </div>
            <div className="mt-4 space-y-2">
              <Input placeholder="Your name" />
              <Input placeholder="Email" />
              <Input placeholder="Resume link" />
              <Button className="w-full">Quick Apply</Button>
              <Button variant="secondary" className="w-full">Save</Button>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
