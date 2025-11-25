import { useState, useEffect } from "react";
import {
  Building2,
  MapPin,
  Briefcase,
  Clock,
  GraduationCap,
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import api from "../../../components/apiconfig/apiconfig";

export default function Jobs() {
  const [jobList, setJobList] = useState([]);

  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [exp, setExp] = useState("");
  const [mode, setMode] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/jobs", { params: { limit: 100 } });

        if (!alive) return;

        if (data.ok && Array.isArray(data.jobs)) {
          const mapped = data.jobs.map((j) => ({
            id: j.id,
            title: j.title,
            company: j.company,
            loc: j.location,
            mode: j.type,
            exp: j.experiance,
            type: j.type,
            tags: j.tags || [],
          }));
          setJobList(mapped);
          setFiltered(mapped);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const handleSearch = () => {
    let data = jobList;

    const roleTrim = role.trim().toLowerCase();
    const locationTrim = location.trim().toLowerCase();

    if (roleTrim !== "")
      data = data.filter(
        (job) =>
          job.title.toLowerCase().includes(roleTrim) ||
          job.tags.join(" ").toLowerCase().includes(roleTrim)
      );

    if (locationTrim !== "")
      data = data.filter((job) =>
        job.loc.toLowerCase().includes(locationTrim)
      );

    if (exp && exp !== "Experience")
      data = data.filter((job) =>
        job.exp.toLowerCase().includes(exp.toLowerCase())
      );

    if (mode && mode !== "Work mode")
      data = data.filter((job) =>
        job.mode.toLowerCase().includes(mode.toLowerCase())
      );

    setFiltered(data);
    setPage(1);
  };

  useEffect(() => {
    handleSearch();
  }, [role, location, exp, mode]);

  const pageSize = 4;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(filtered.length / pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages || 1);
  }, [filtered, totalPages, page]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-1">Find Jobs</h1>
      <p className="text-slate-600 mb-4">
        Internships and entry-level roles for students & 0–2 yrs.
      </p>

      <div className="grid md:grid-cols-6 gap-2 bg-white p-3 rounded-2xl border mb-4">
        <Input
          placeholder="Role or skill"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="md:col-span-2"
        />

        <Input
          placeholder="Location (Remote, Bengaluru...)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <select
          className="rounded-xl border p-2 text-sm"
          value={exp}
          onChange={(e) => setExp(e.target.value)}
        >
          <option>Experience</option>
          <option>Student</option>
          <option>Fresher (0 yrs)</option>
          <option>1–2 yrs</option>
        </select>

        <select
          className="rounded-xl border p-2 text-sm"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option>Work mode</option>
          <option>Remote</option>
          <option>Hybrid</option>
          <option>Office</option>
        </select>

        <Button onClick={handleSearch} className="hidden md:inline-flex">
          Search
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-3 py-2 text-left">Job Title</th>
              <th className="px-3 py-2 text-left">Company</th>
              <th className="px-3 py-2 text-left">Location</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Mode</th>
              <th className="px-3 py-2 text-left">Experience</th>
              <th className="px-3 py-2 text-left">Tags</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-slate-500">
                  No jobs found
                </td>
              </tr>
            ) : (
              paginated.map((r) => (
                <tr key={r.id} className="border-b hover:bg-slate-50 transition">
                  <td className="px-3 py-2 align-middle whitespace-nowrap">
                    {r.title}
                  </td>

                  <td className="px-3 py-2 align-middle whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Building2 size={14} /> {r.company}
                    </div>
                  </td>

                  <td className="px-3 py-2 align-middle whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} /> {r.loc}
                    </div>
                  </td>

                  <td className="px-3 py-2 align-middle whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Briefcase size={14} /> {r.type}
                    </div>
                  </td>

                  <td className="px-3 py-2 align-middle whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Clock size={14} /> {r.mode}
                    </div>
                  </td>

                  <td className="px-3 py-2 align-middle whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <GraduationCap size={14} /> {r.exp}
                    </div>
                  </td>

                  <td className="px-3 py-2 align-middle">
                    <div className="flex flex-wrap gap-1">
                      {r.tags.map((t) => (
                        <Badge
                          key={t}
                          variant="outline"
                          className="rounded-full text-xs"
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </td>

                  <td className="px-3 py-2 align-middle whitespace-nowrap">
                    <div className="flex gap-2">
                      <a href={`/jobs/${r.id}`} className="flex-1">
                        <Button variant="secondary" className="w-full text-xs">
                          View
                        </Button>
                      </a>
                      <Button className="flex-1 text-xs">Apply</Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNum = i + 1;
          const active = page === pageNum;
          return (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`px-3 py-1 text-sm rounded-md border ${
                active
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
