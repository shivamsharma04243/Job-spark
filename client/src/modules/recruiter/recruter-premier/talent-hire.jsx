import React, { useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

// Sample student data only for testing purposes
const SAMPLE_STUDENTS = [
  {
    id: 1,
    name: "Shivam Sharma",
    role: "Software Developer",
    experience: "Experienced",
    location: "Bengaluru",
    skills: ["React", "Node.js", "DSA"],
    resumeUrl: "https://example.com/resumes/aarav-sharma.pdf",
  },
  {
    id: 2,
    name: "Isha Verma",
    role: "Data Analyst",
    experience: "Fresher",
    location: "Gurugram",
    skills: ["SQL", "Excel", "Power BI"],
    resumeUrl: "https://example.com/resumes/isha-verma.pdf",
  },
  {
    id: 3,
    name: "Rohit Patel",
    role: "Software Developer",
    experience: "Experienced",
    location: "Pune",
    skills: ["TypeScript", "Next.js", "REST"],
    resumeUrl: "https://example.com/resumes/rohit-patel.pdf",
  },
  {
    id: 4,
    name: "Yuvraj Singh",
    role: "UI/UX Designer",
    experience: "Fresher",
    location: "Remote",
    skills: ["Figma", "Wireframing", "Prototyping"],
    resumeUrl: "https://example.com/resumes/ananya-singh.pdf",
  },
];

const CATEGORIES = ["All", "Software Developer", "Data Analyst", "UI/UX Designer"];
const EXPERIENCES = ["All", "Fresher", "Experienced"];

export default function TalentHire() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [experience, setExperience] = useState("All");

  const filtered = useMemo(() => {
    return SAMPLE_STUDENTS.filter((s) => {
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.role.toLowerCase().includes(search.toLowerCase()) ||
        s.skills.join(" ").toLowerCase().includes(search.toLowerCase());

      const matchCategory = category === "All" || s.role === category;
      const matchExperience = experience === "All" || s.experience === experience;

      return matchSearch && matchCategory && matchExperience;
    });
  }, [search, category, experience]);

  const handleViewResume = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
      <main className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Hire-Talent </h1>
          <p className="text-slate-600 mt-1">Filter and view student profiles. Click "View Resume" to open the resume.</p>
        </header>

        <Card className="rounded-2xl shadow-sm mb-6">
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium mb-1">Search</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, role, skills"
                className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium mb-1">Job Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-sm font-medium mb-1">Experience</label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {EXPERIENCES.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s) => (
            <Card key={s.id} className="rounded-2xl bg-white shadow-sm">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg">{s.name}</CardTitle>
                <div className="text-sm text-slate-500">{s.role} • {s.experience}</div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-600">{s.location}</div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {s.skills.map((sk, i) => (
                    <span key={i} className="px-2 py-1 text-xs rounded-md border bg-slate-50">{sk}</span>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <Button className="px-4" onClick={() => handleViewResume(s.resumeUrl)}>View Resume</Button>
                  <Button variant="secondary" className="px-4">Shortlist</Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center text-slate-600 py-10 border rounded-2xl">
              No students match your filters.
            </div>
          )}
        </section>
      </main>
    
  );
}