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

  const pageSize = 6;
  const [page, setPage] = useState(1);

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
        setError((err && err.message) || "Something went wrong");
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
        (job.exp || "").toLowerCase().includes(exp.toLowerCase())
      );

    if (mode && mode !== "Work mode")
      data = data.filter((job) =>
        (job.mode || "").toLowerCase().includes(mode.toLowerCase())
      );

    setFiltered(data);
    setPage(1);
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, location, exp, mode]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;

  useEffect(() => {
    if (page > totalPages) setPage(totalPages || 1);
  }, [filtered, totalPages, page]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const startIdx = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIdx = (page - 1) * pageSize + paginated.length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
            Open positions
          </h1>
          <p className="mt-1 text-sm md:text-base text-slate-600">
            Explore internships and early-career roles across locations and work modes.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[280px,1fr] gap-8">
          {/* Sidebar */}
          <aside className="bg-white border border-slate-200 rounded-xl p-5 h-fit md:sticky md:top-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-slate-900">Filter jobs</h2>
              {(role ||
                location ||
                (exp && exp !== "Experience") ||
                (mode && mode !== "Work mode")) && (
                <button
                  className="text-[11px] text-slate-500 hover:text-slate-700"
                  onClick={() => {
                    setRole("");
                    setLocation("");
                    setExp("");
                    setMode("");
                  }}
                >
                  Reset
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Role or keyword
                </label>
                <Input
                  placeholder="e.g. Frontend, Designer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Location
                </label>
                <Input
                  placeholder="Remote, Bengaluru..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Experience
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800"
                    value={exp}
                    onChange={(e) => setExp(e.target.value)}
                  >
                    <option>Experience</option>
                    <option>Student</option>
                    <option>Fresher (0 yrs)</option>
                    <option>1–2 yrs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Work mode
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-300 bg-white p-2 text-xs text-slate-800"
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                  >
                    <option>Work mode</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                    <option>Office</option>
                  </select>
                </div>
              </div>

              <Button
                onClick={handleSearch}
                className="w-full text-sm mt-1 bg-slate-900 hover:bg-slate-800"
              >
                Apply filters
              </Button>
            </div>
          </aside>

          {/* Content */}
          <section>
            {error && (
              <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <div className="mb-4 flex items-center justify-between text-xs md:text-sm text-slate-600">
              <span>
                Showing {startIdx}–{endIdx} of {filtered.length} roles
              </span>
            </div>

            {loading ? (
              <div className="border border-slate-200 rounded-xl bg-white p-10 text-center text-slate-500 text-sm">
                Loading roles…
              </div>
            ) : paginated.length === 0 ? (
              <div className="border border-slate-200 rounded-xl bg-white p-10 text-center text-slate-500 text-sm">
                No roles match these filters.
              </div>
            ) : (
              <div className="space-y-4">
                {paginated.map((r) => (
                  <article
                    key={r.id}
                    className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex flex-col gap-3 shadow-sm hover:shadow-md hover:border-slate-300 transition-colors"
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-slate-900">
                          {r.title}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                          <span className="inline-flex items-center gap-1.5">
                            <Building2 size={16} /> {r.company}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={16} /> {r.loc}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-50 border border-slate-200">
                          <Briefcase size={14} /> {r.type}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-50 border border-slate-200">
                          <Clock size={14} /> {r.mode}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-50 border border-slate-200">
                          <GraduationCap size={14} /> {r.exp}
                        </span>
                      </div>
                    </div>

                    {r.tags && r.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {r.tags.map((t) => (
                          <Badge
                            key={t}
                            variant="outline"
                            className="rounded-full text-[10px] border-slate-200 text-slate-600"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col gap-2 pt-2 md:flex-row md:justify-end">
                      <a href={`/jobs/${r.id}`} className="md:w-auto w-full">
                        <Button
                          variant="outline"
                          className="w-full md:w-auto border-slate-300 text-slate-800 hover:bg-slate-50"
                        >
                          View details
                        </Button>
                      </a>
                      <Button className="md:w-auto w-full bg-slate-900 hover:bg-slate-800">
                        Apply
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs md:text-sm text-slate-700 disabled:opacity-50"
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
                    className={`px-3 py-1.5 text-xs md:text-sm rounded-md border ${
                      active
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs md:text-sm text-slate-700 disabled:opacity-50"
                disabled={page === totalPages || filtered.length === 0}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
