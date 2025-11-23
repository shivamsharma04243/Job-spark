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
import Navbar from "../../../components/ui/Navbar";

export default function Jobs() {
  const [jobList, setJobList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ---------- FILTER STATES (must be declared before useEffect) ----------
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [exp, setExp] = useState("");
  const [mode, setMode] = useState("");
  const [filtered, setFiltered] = useState([]);
  
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const api = (await import("../../../components/apiconfig/apiconfig")).default;
        const { data } = await api.get('/jobs', { params: { limit: 100 } });
        if (!alive) return;
        if (data.ok && Array.isArray(data.jobs)) {
          const jobs = data.jobs.map(j => ({
            id: j.id,
            title: j.title,
            company: j.company,
            loc: j.location,
            mode: j.type,
            exp: j.experiance,
            type: j.type,
            tags: j.tags || [],
          }));
          setJobList(jobs);
          setFiltered(jobs); // Initialize filtered list with all jobs
        } else {
          setJobList([]);
          setFiltered([]);
        }
      } catch (err) {
        console.error('Failed to load jobs:', err);
        setError(err.message || 'Failed to load jobs');
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  // ---------- SEARCH FUNCTION ----------
  const handleSearch = () => {
    let data = jobList;

    // Filter by role/skill (search in title and tags)
    if (role.trim() !== "")
      data = data.filter(
        (job) =>
          job.title.toLowerCase().includes(role.toLowerCase()) ||
          job.tags.some(tag => tag.toLowerCase().includes(role.toLowerCase()))
      );

    // Filter by location
    if (location.trim() !== "")
      data = data.filter((job) =>
        job.loc.toLowerCase().includes(location.toLowerCase())
      );

    // Filter by experience (match any part of the experience string)
    if (exp && exp !== "") {
      data = data.filter((job) => {
        const expLower = job.exp.toLowerCase();
        const filterLower = exp.toLowerCase();
        // Check if filter matches the job's experience level
        if (exp === "Fresher") return expLower.includes("fresher");
        if (exp === "1–2 yrs") return expLower.includes("1") || expLower.includes("2");
        if (exp === "All") return true; // show all
        return expLower.includes(filterLower);
      });
    }

    // Filter by job type (Full-time, Part-time, etc.)
    if (mode && mode !== "Job type") {
      data = data.filter((job) =>
        job.type && job.type.toLowerCase().includes(mode.toLowerCase())
      );
    }

    setFiltered(data);
    setPage(1); // reset pagination
  };

  // ---------- PAGINATION ----------
  const pageSize = 4;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(filtered.length / pageSize);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold mb-2">Find Jobs</h1>
        <p className="text-slate-600 mb-6">
          Internships and entry-level roles for students & 0–2 yrs.
        </p>

        {/* FILTERS */}
        <div className="grid md:grid-cols-6 gap-3 bg-white p-4 rounded-2xl border mb-6">
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
            <option value="">Experience</option>
            <option value="Fresher">Fresher</option>
            <option value="1–2 yrs">1–2 yrs</option>
            <option value="Not specified">All</option>
          </select>

          <select
            className="rounded-xl border p-2 text-sm"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="">Job type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>

          <Button onClick={handleSearch}>Search</Button>
        </div>

        {/* LOADING / ERROR STATE */}
        {loading && (
          <div className="text-center py-10 text-slate-500">
            Loading jobs...
          </div>
        )}
        {error && !loading && (
          <div className="text-center py-10 text-red-500">
            Error: {error}
          </div>
        )}

        {/* TABLE */}
        {!loading && !error && (
        <div className="overflow-x-auto rounded-2xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="px-4 py-3 text-left whitespace-nowrap">
                  Job Title
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap">
                  Company
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap">
                  Location
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Type</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Mode</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">
                  Experience
                </th>
                <th className="px-4 py-3 text-left whitespace-nowrap">Tags</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-slate-500">
                    No jobs found
                  </td>
                </tr>
              ) : (
                paginated.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-3 font-medium align-middle whitespace-nowrap">
                      {r.title}
                    </td>

                    <td className="px-4 py-3 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Building2 size={14} /> {r.company}
                      </div>
                    </td>

                    <td className="px-4 py-3 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} /> {r.loc}
                      </div>
                    </td>

                    <td className="px-4 py-3 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Briefcase size={14} /> {r.type}
                      </div>
                    </td>

                    <td className="px-4 py-3 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock size={14} /> {r.mode}
                      </div>
                    </td>

                    <td className="px-4 py-3 align-middle whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <GraduationCap size={14} /> {r.exp}
                      </div>
                    </td>

                    <td className="px-4 py-3 align-middle">
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

                    <td className="px-4 py-3 align-middle whitespace-nowrap">
                      <div className="flex gap-2">
                        <a href={`/jobs/${r.id}`} className="flex-1">
                          <Button
                            variant="secondary"
                            className="w-full text-xs"
                          >
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
        )}

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-3 mt-6">
          <Button
            className="bg-white border-2 text-gray-800 shadow-sm "
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>

          {[...Array(totalPages)].map((_, i) => (
            <Button
              className="bg-white border-2 text-gray-800 shadow-sm "
              key={i}
              variant={page === i + 1 ? "default" : "outline"}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            className="bg-white border-2 text-gray-800 shadow-sm "
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
