import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Building2,
  MapPin,
  Briefcase,
  GraduationCap,
  Bookmark,
  BookmarkCheck,
  Clock,
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
  const [type, setType] = useState("");
  const [mode, setMode] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedStatus, setSavedStatus] = useState({});
  
  const locationHook = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(locationHook.search);
    const searchQuery = searchParams.get('search') || '';
    if (searchQuery) {
      setRole(searchQuery);
    }
  }, [locationHook]);

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
            id: j._id || j.id,
            title: j.title || j.jobTitle || "",
            company: j.company || j.companyName || "",
            location: j.location || j.jobLocation || "",
            type: j.type || j.jobType || "",
            mode: j.mode || j.workMode || j.workType || "",
            experience: j.experience || j.experiance || j.exp || "",
            skills: j.skills || j.tags || [], // Use skills field
            salary: j.salary || "",
            description: j.description || "",
          }));
          setJobList(mapped);
          setFiltered(mapped);

          await checkSavedStatusForJobs(mapped);
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

  const checkSavedStatusForJobs = async (jobs) => {
    const status = {};
    for (const job of jobs) {
      try {
        const response = await api.get(`/jobs/save/${job.id}`);
        status[job.id] = response.data.isSaved;
      } catch (error) {
        console.error(`Error checking saved status for job ${job.id}:`, error);
        status[job.id] = false;
      }
    }
    setSavedStatus(status);
  };

  const toggleSaveJob = async (jobId, isCurrentlySaved) => {
    try {
      if (isCurrentlySaved) {
        await api.delete(`/jobs/save/${jobId}`);
        setSavedStatus(prev => ({ ...prev, [jobId]: false }));
      } else {
        await api.post(`/jobs/save/${jobId}`);
        setSavedStatus(prev => ({ ...prev, [jobId]: true }));
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      alert('Error saving job: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSearch = () => {
    if (jobList.length === 0) return;

    let data = [...jobList];

    const roleTrim = role.trim().toLowerCase();
    const locationTrim = location.trim().toLowerCase();

    if (roleTrim !== "") {
      data = data.filter((job) => {
        const titleMatch = job.title?.toLowerCase().includes(roleTrim) || false;
        const companyMatch = job.company?.toLowerCase().includes(roleTrim) || false;
        const skillsMatch = job.skills?.some(skill => 
          skill?.toLowerCase().includes(roleTrim)
        ) || false;
        const descriptionMatch = job.description?.toLowerCase().includes(roleTrim) || false;
        
        return titleMatch || companyMatch || skillsMatch || descriptionMatch;
      });
    }

    if (locationTrim !== "") {
      data = data.filter((job) =>
        job.location?.toLowerCase().includes(locationTrim)
      );
    }

    if (exp && exp !== "Experience") {
      data = data.filter((job) =>
        (job.experience || "").toLowerCase().includes(exp.toLowerCase())
      );
    }

    if (mode && mode !== "Work mode") {
      data = data.filter((job) =>
        (job.mode || "").toLowerCase().includes(mode.toLowerCase())
      );
    }

    setFiltered(data);
    setPage(1);
    
    const params = new URLSearchParams();
    if (roleTrim) params.set('search', roleTrim);
    if (locationTrim) params.set('location', locationTrim);
    if (exp && exp !== "Experience") params.set('experience', exp);
    if (type && type !== "Type") params.set('type', type);
    
    const newUrl = params.toString() ? `/jobs?${params.toString()}` : '/jobs';
    window.history.replaceState({}, '', newUrl);
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, location, exp, mode]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    } else if (totalPages === 0) {
      setPage(1);
    }
  }, [filtered, totalPages, page]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const startIdx = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIdx = (page - 1) * pageSize + paginated.length;

  const hasFilters =
    !!role.trim() ||
    !!location.trim() ||
    (exp && exp !== "Experience") ||
    (mode && mode !== "Work mode");

  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-10 md:py-12">
        <header className="mb-8">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 mb-3">
            Browse jobs
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Open positions
          </h1>
          <p className="mt-1 text-sm md:text-base text-slate-600 max-w-2xl">
            Explore internships and early‑career roles across locations, experience levels, and work modes.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[280px,1fr] gap-8 lg:gap-10">
          {/* Sidebar */}
          <aside className="bg-white border border-slate-200 rounded-2xl p-5 h-fit md:sticky md:top-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-900">Filter jobs</h2>
              {hasFilters && (
                <button
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-[11px] text-slate-600 hover:bg-slate-50"
                  onClick={() => {
                    setRole("");
                    setLocation("");
                    setExp("");
                    setMode("");
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            {hasFilters && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {role.trim() && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 text-[11px] text-blue-700">
                    Role: {role.trim()}
                  </span>
                )}
                {location.trim() && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 text-[11px] text-blue-700">
                    Location: {location.trim()}
                  </span>
                )}
                {exp && exp !== "Experience" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 text-[11px] text-blue-700">
                    Exp: {exp}
                  </span>
                )}
                {mode && mode !== "Work mode" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-100 px-2 py-0.5 text-[11px] text-blue-700">
                    Mode: {mode}
                  </span>
                )}
              </div>
            )}

            <div className="space-y-4 pt-1 border-t border-slate-100">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Role or keyword
                </label>
                <Input
                  placeholder="e.g. Frontend, Designer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="text-sm bg-slate-50 border-slate-200"
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
                  className="text-sm bg-slate-50 border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Experience
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800"
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
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800"
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
                className="w-full text-sm mt-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm hover:shadow-md transition-all"
              >
                Apply filters
              </Button>
            </div>
          </aside>

          {/* Content */}
          <section className="space-y-4">
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
              <div className="border border-slate-200 rounded-2xl bg-white p-10 text-center text-slate-500 text-sm shadow-sm">
                Loading roles…
              </div>
            ) : paginated.length === 0 ? (
              <div className="border border-slate-200 rounded-2xl bg-white p-10 text-center text-slate-500 text-sm shadow-sm">
                No roles match these filters.
              </div>
            ) : (
              <div className="space-y-4">
                {paginated.map((r) => (
                  <article
                    key={r.id}
                    className="bg-white border border-slate-200 rounded-2xl px-5 py-4 flex flex-col gap-3 shadow-sm hover:shadow-lg hover:border-blue-100 hover:-translate-y-1 transition-all duration-200"
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
                            <MapPin size={16} /> {r.location}
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
                          <GraduationCap size={14} /> {r.experience}
                        </span>
                      </div>
                    </div>

                    {r.skills && r.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {r.skills.map((t) => (
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
                          className="w-full md:w-auto border-blue-100 text-blue-700 bg-blue-50 hover:bg-blue-100"
                        >
                          View details
                        </Button>
                      </a>
                      <Button className="md:w-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm hover:shadow-md">
                        Apply
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                className="rounded-full border border-slate-300 px-3 py-1.5 text-xs md:text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
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
                    className={`px-3 py-1.5 text-xs md:text-sm rounded-full border ${
                      active
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-blue-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                className="rounded-full border border-slate-300 px-3 py-1.5 text-xs md:text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50"
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