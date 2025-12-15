import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  Briefcase,
  GraduationCap,
  Bookmark,
  BookmarkCheck,
  Clock,
  Search,
  ArrowUpRight,
} from "lucide-react";
import api from "../../../components/apiconfig/apiconfig";

const CITY_OPTIONS = [
  "Delhi",
  "Ghaziabad",
  "Noida",
  "Faridabad",
  "Greater Noida",
  "Gurgaon",
];

const ROLE_OPTIONS = [
  { label: "Trainer", value: "trainer" },
  { label: "Recruiter / HR / Admin", value: "recruiter" },
  { label: "Event Management", value: "event management" },
  { label: "Back Office / Data Entry", value: "data entry" },
  { label: "Content Writer", value: "content writer" },
  { label: "Receptionist", value: "receptionist" },
  { label: "+ 1 More", value: "assistant" },
];

const SALARY_OPTIONS = [
  { label: "More than ₹ 5000", value: 5000 },
  { label: "More than ₹ 10000", value: 10000 },
  { label: "More than ₹ 20000", value: 20000 },
  { label: "More than ₹ 30000", value: 30000 },
  { label: "More than ₹ 40000", value: 40000 },
  { label: "More than ₹ 50000", value: 50000 },
];

const OTHER_CATEGORIES = [
  "Event Management (304)",
  "Back Office / Data Entry (12258)",
  "Content Writer (419)",
  "Receptionist (2481)",
  "Accountant (7733)",
];

const pageSize = 6;

const parseSalaryValue = (salary) => {
  if (!salary) return null;
  const numeric = `${salary}`.replace(/[^0-9]/g, "");
  if (!numeric) return null;
  return Number(numeric);
};

const formatSalary = (salary, minSalary, maxSalary) => {
  // Use minSalary and maxSalary if available (preferred)
  if (minSalary != null && maxSalary != null) {
    return `₹ ${Number(minSalary).toLocaleString('en-IN')} - ${Number(maxSalary).toLocaleString('en-IN')}`;
  } else if (minSalary != null) {
    return `₹ ${Number(minSalary).toLocaleString('en-IN')}+`;
  } else if (maxSalary != null) {
    return `Up to ₹ ${Number(maxSalary).toLocaleString('en-IN')}`;
  }

  // Fallback: try to parse from salary string if min/max not available
  const numeric = parseSalaryValue(salary);
  if (!numeric) return salary || "";
  return `₹ ${numeric.toLocaleString("en-IN")}`;
};

export default function Jobs() {
  const [jobList, setJobList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [salaryFilter, setSalaryFilter] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedStatus, setSavedStatus] = useState({});
  const [page, setPage] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const locationHook = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get("/auth/session");
        if (alive) setIsAuthenticated(Boolean(data?.user));
      } catch (err) {
        if (alive) setIsAuthenticated(false);
      } finally {
        if (alive) setAuthChecked(true);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(locationHook.search);
    const searchQuery = searchParams.get("search") || "";
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [locationHook]);

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
            type: j.type || j.jobType || "Full Time",
            workMode: j.workMode || j.mode || j.workType || "Office",
            experience: j.experience || j.experiance || j.exp || "",
            skills: j.skills || j.tags || [],
            salary: j.salary || "",
            minSalary: j.minSalary,
            maxSalary: j.maxSalary,
            vacancies: j.vacancies || "",
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
        status[job.id] = false;
      }
    }
    setSavedStatus(status);
  };

  const redirectToLoginForSave = (jobId) => {
    try {
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem("postLoginSaveJobId", jobId);
      localStorage.setItem("postLoginRedirect", currentPath || "/jobs");
    } catch (err) {
      // fail silently if storage not available
    }
    navigate("/sign-in");
  };

  const toggleSaveJob = async (jobId, isCurrentlySaved) => {
    if (!isAuthenticated) {
      // If auth status is still being checked, try one more quick check
      if (!authChecked) {
        try {
          const { data } = await api.get("/auth/session");
          if (data?.user) {
            setIsAuthenticated(true);
          } else {
            redirectToLoginForSave(jobId);
            return;
          }
        } catch (err) {
          redirectToLoginForSave(jobId);
          return;
        }
      } else {
        redirectToLoginForSave(jobId);
        return;
      }
    }

    try {
      if (isCurrentlySaved) {
        await api.delete(`/jobs/save/${jobId}`);
        setSavedStatus((prev) => ({ ...prev, [jobId]: false }));
      } else {
        await api.post(`/jobs/save/${jobId}`);
        setSavedStatus((prev) => ({ ...prev, [jobId]: true }));
      }
    } catch (error) {
      alert(
        "Error saving job: " +
        (error.response?.data?.message || error.message || "Try again")
      );
    }
  };

  const applyFilters = useCallback(() => {
    if (jobList.length === 0) return;

    let data = [...jobList];
    const query = searchTerm.trim().toLowerCase();

    if (query) {
      data = data.filter((job) => {
        const textBucket = [
          job.title,
          job.company,
          job.location,
          job.description,
          ...(job.skills || []),
        ]
          .join(" ")
          .toLowerCase();
        return textBucket.includes(query);
      });
    }

    if (selectedCities.length) {
      data = data.filter((job) =>
        selectedCities.some((city) =>
          (job.location || "").toLowerCase().includes(city.toLowerCase())
        )
      );
    }

    if (selectedRoles.length) {
      data = data.filter((job) => {
        const haystack = `${job.title} ${job.company} ${(job.skills || []).join(
          " "
        )}`.toLowerCase();
        return selectedRoles.some((role) =>
          haystack.includes(role.toLowerCase())
        );
      });
    }

    if (salaryFilter) {
      const threshold = Number(salaryFilter);
      data = data.filter((job) => {
        // Check min_salary first, then fallback to parsing salary string
        if (job.minSalary != null) {
          return job.minSalary >= threshold;
        }
        const numeric = parseSalaryValue(job.salary);
        if (!numeric) return true; // keep jobs without salary info
        return numeric >= threshold;
      });
    }

    setFiltered(data);
    setPage(1);

    const params = new URLSearchParams();
    if (query) params.set("search", query);
    const newUrl = params.toString() ? `/jobs?${params.toString()}` : "/jobs";
    window.history.replaceState({}, "", newUrl);
  }, [jobList, searchTerm, selectedCities, selectedRoles, salaryFilter]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filtered.length / pageSize)),
    [filtered.length]
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginated = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page]
  );

  const startIdx = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIdx = (page - 1) * pageSize + paginated.length;

  const hasSidebarFilters =
    selectedCities.length > 0 ||
    selectedRoles.length > 0 ||
    Boolean(salaryFilter);

  const toggleValue = (value, setFn) => {
    setFn((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    setSelectedCities([]);
    setSelectedRoles([]);
    setSalaryFilter("");
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="container-custom py-8 sm:py-10 md:py-12">
        <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-text-muted mb-1">
                {filtered.length || jobList.length} jobs near you
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-dark">
                Find Jobs
              </h1>
            </div>
            <div className="w-full sm:w-auto sm:min-w-[320px] md:min-w-[420px]">
              <div className="flex items-center gap-2 card px-3 sm:px-4 py-2.5">
                <Search size={18} className="text-text-muted flex-shrink-0" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                  className="flex-1 text-sm sm:text-base outline-none bg-transparent text-text-dark placeholder:text-text-muted"
                  placeholder="Search jobs here"
                />
                <button
                  onClick={applyFilters}
                  className="btn btn-primary btn-sm flex-shrink-0"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-4 sm:gap-6 lg:gap-8">
          <aside className="card card-padding lg:sticky lg:top-4 lg:self-start">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-text-dark">Filters</h2>
              {hasSidebarFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-text-dark mb-3">City</p>
                <div className="flex flex-wrap gap-2">
                  {CITY_OPTIONS.map((city) => {
                    const active = selectedCities.includes(city);
                    return (
                      <button
                        key={city}
                        onClick={() => toggleValue(city, setSelectedCities)}
                        className={`rounded-chip px-3 py-1.5 text-xs font-medium transition-colors ${active
                            ? "bg-primary-50 border-2 border-primary-200 text-primary-700"
                            : "bg-white border-2 border-border text-text-muted hover:bg-gray-50"
                          }`}
                      >
                        {city}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-text-dark mb-3">
                  Job Role(s)
                </p>
                <div className="flex flex-wrap gap-2">
                  {ROLE_OPTIONS.map((role) => {
                    const active = selectedRoles.includes(role.value);
                    return (
                      <button
                        key={role.value}
                        onClick={() => toggleValue(role.value, setSelectedRoles)}
                        className={`rounded-chip px-3 py-1.5 text-xs font-medium transition-colors ${active
                            ? "bg-primary-50 border-2 border-primary-200 text-primary-700"
                            : "bg-white border-2 border-border text-text-muted hover:bg-gray-50"
                          }`}
                      >
                        {role.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-text-dark mb-3">Salary</p>
                <div className="space-y-2">
                  {SALARY_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2.5 text-sm text-text-dark cursor-pointer hover:text-primary-600 transition-colors"
                    >
                      <input
                        type="radio"
                        name="salary"
                        value={opt.value}
                        checked={String(salaryFilter) === String(opt.value)}
                        onChange={(e) => setSalaryFilter(e.target.value)}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <section className="space-y-4 sm:space-y-6">
            {error && (
              <div className="text-sm text-error-600 bg-error-light border border-error-300 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-text-muted">
              <span>
                Showing {startIdx}–{endIdx} of {filtered.length} roles
              </span>
              {hasSidebarFilters && (
                <span className="badge badge-primary">
                  Filters applied
                </span>
              )}
            </div>

            {loading ? (
              <div className="card card-padding text-center text-text-muted text-sm">
                <div className="animate-pulse">Loading roles…</div>
              </div>
            ) : paginated.length === 0 ? (
              <div className="card card-padding text-center text-text-muted text-sm">
                No roles match these filters.
              </div>
            ) : (
              <div className="space-y-4">
                {paginated.map((r) => (
                  <article
                    key={r.id}
                    className="relative card card-hover card-padding"
                  >
                    <button
                      onClick={() => toggleSaveJob(r.id, savedStatus[r.id])}
                      className="absolute right-4 sm:right-6 top-4 sm:top-6 text-text-muted hover:text-primary-600 transition-colors z-10"
                      aria-label={savedStatus[r.id] ? "Unsave job" : "Save job"}
                    >
                      {savedStatus[r.id] ? (
                        <BookmarkCheck size={18} className="text-primary-600" />
                      ) : (
                        <Bookmark size={18} />
                      )}
                    </button>

                    <div className="flex flex-col gap-3 sm:gap-4 pr-8 sm:pr-10">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="space-y-1.5 flex-1">
                          <p className="text-xs text-text-muted uppercase tracking-wider font-medium">
                            {r.workMode || "Work from home"}
                          </p>
                          <h3 className="text-lg sm:text-xl font-semibold text-text-dark">
                            {r.title || "Untitled role"}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
                            {r.company && (
                              <span className="inline-flex items-center gap-1.5">
                                <Building2 size={16} className="text-primary-500" /> {r.company}
                              </span>
                            )}
                            {r.location && (
                              <span className="inline-flex items-center gap-1.5">
                                <MapPin size={16} className="text-primary-500" /> {r.location}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          {(r.minSalary != null || r.maxSalary != null || r.salary) && (
                            <p className="text-lg sm:text-xl font-semibold text-text-dark">
                              {formatSalary(r.salary, r.minSalary, r.maxSalary)} /Month
                            </p>
                          )}
                          {r.vacancies && (
                            <p className="text-xs text-text-muted mt-1">{r.vacancies} vacancies</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {r.type && (
                          <span className="badge badge-gray inline-flex items-center gap-1">
                            <Briefcase size={14} /> {r.type}
                          </span>
                        )}
                        {r.workMode && (
                          <span className="badge badge-gray inline-flex items-center gap-1">
                            <Clock size={14} /> {r.workMode}
                          </span>
                        )}
                        {r.experience && (
                          <span className="badge badge-gray inline-flex items-center gap-1">
                            <GraduationCap size={14} /> {r.experience}
                          </span>
                        )}
                        {r.vacancies && (
                          <span className="badge badge-gray">
                            {r.vacancies} Vacancies
                          </span>
                        )}
                      </div>

                      {r.skills && r.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {r.skills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs border border-border text-text-muted bg-gray-50"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-col gap-3 pt-2 border-t border-border sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap gap-2">
                          <span className="badge badge-primary text-xs">
                            New
                          </span>
                          {r.vacancies && (
                            <span className="badge badge-warning text-xs">
                              {r.vacancies} Vacancies
                            </span>
                          )}
                          <span className="badge badge-success text-xs">
                            Full Time
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`/jobs/${r.id}`}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                          >
                            View details
                            <ArrowUpRight size={16} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="flex justify-center items-center gap-2 mt-6 sm:mt-8">
              <button
                className="btn btn-ghost btn-sm rounded-full"
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
                    className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm rounded-full border transition-colors ${active
                        ? "bg-primary-500 text-white border-primary-500 shadow-soft"
                        : "bg-white text-text-dark border-border hover:bg-primary-50"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                className="btn btn-ghost btn-sm rounded-full"
                disabled={page === totalPages || filtered.length === 0}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>

            <div className="mt-6 card card-padding">
              <p className="flex items-center gap-2 text-sm font-semibold text-text-dark mb-4">
                Explore jobs in other categories
              </p>
              <div className="flex flex-wrap gap-2">
                {OTHER_CATEGORIES.map((cat) => (
                  <span
                    key={cat}
                    className="badge badge-gray"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

