import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
import { CATEGORY_FILTER_MAPPING } from "../home/data";

// Static filter options (frontend constants)
const SALARY_OPTIONS = [
  { label: "More than ₹ 5000", value: 5000 },
  { label: "More than ₹ 10000", value: 10000 },
  { label: "More than ₹ 20000", value: 20000 },
  { label: "More than ₹ 30000", value: 30000 },
  { label: "More than ₹ 40000", value: 40000 },
  { label: "More than ₹ 50000", value: 50000 },
];

// Static job type filter options (from jobs.job_type enum)
const JOB_TYPE_OPTIONS = [
  { label: "Full-time", value: "full-time" },
  { label: "Part-time", value: "part-time" },
  { label: "Internship", value: "internship" },
  { label: "Contract", value: "contract" },
];

// Static work mode filter options (from jobs.work_mode enum)
const WORK_MODE_OPTIONS = [
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
  { label: "Office", value: "office" },
];

// Static experience filter ranges
const EXPERIENCE_OPTIONS = [
  { label: "Fresher (0 years)", value: "0" },
  { label: "0-2 years", value: "0-2" },
  { label: "2-5 years", value: "2-5" },
  { label: "5-10 years", value: "5-10" },
  { label: "10+ years", value: "10+" },
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
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedWorkModes, setSelectedWorkModes] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedStatus, setSavedStatus] = useState({});
  const [page, setPage] = useState(1);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Dynamic filter options (from backend)
  const [cityOptions, setCityOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]); // from job_roles
  const [tagOptions, setTagOptions] = useState([]);

  const locationHook = useLocation();
  const navigate = useNavigate();
  const isClearingFilters = useRef(false);

  // Check auth and redirect recruiters to their job listing page
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get("/auth/session");
        if (alive) {
          setIsAuthenticated(Boolean(data?.user));
          setUserRole(data?.user?.role || null);

          // Redirect recruiters and admins away from candidate job browsing
          if (data?.user?.role === "recruiter") {
            navigate("/job-posted", { replace: true });
            return;
          }
          if (data?.user?.role === "admin") {
            navigate("/admin/jobs", { replace: true });
            return;
          }
        }
      } catch (err) {
        if (alive) {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      } finally {
        if (alive) setAuthChecked(true);
      }
    })();

    return () => {
      alive = false;
    };
  }, [navigate]);

  useEffect(() => {
    // Skip if we're in the process of clearing filters
    if (isClearingFilters.current) {
      isClearingFilters.current = false;
      return;
    }

    const searchParams = new URLSearchParams(locationHook.search);
    const searchQuery = searchParams.get("search") || "";
    const categoryParam = searchParams.get("category") || "";
    const qParam = searchParams.get("q") || "";
    const locationParam = searchParams.get("location") || "";
    const experienceParam = searchParams.get("experience") || "";

    // Set search term from URL params
    if (searchQuery) {
      setSearchTerm(searchQuery);
    } else if (qParam) {
      setSearchTerm(qParam);
    } else if (!searchQuery && !qParam) {
      // Clear search term if no search params in URL
      setSearchTerm("");
    }

    // Apply category filters if category parameter is present
    if (categoryParam && CATEGORY_FILTER_MAPPING[categoryParam]) {
      const categoryFilters = CATEGORY_FILTER_MAPPING[categoryParam].filters;

      // Set job types filter
      if (categoryFilters.jobTypes && Array.isArray(categoryFilters.jobTypes)) {
        setSelectedJobTypes(categoryFilters.jobTypes);
      }

      // Set work modes filter
      if (categoryFilters.workModes && Array.isArray(categoryFilters.workModes)) {
        setSelectedWorkModes(categoryFilters.workModes);
      }

      // Set experience filter
      if (categoryFilters.experience) {
        setSelectedExperience(categoryFilters.experience);
      }

      // Set cities filter
      if (categoryFilters.cities && Array.isArray(categoryFilters.cities)) {
        setSelectedCities(categoryFilters.cities);
      }

      // Set roles filter
      if (categoryFilters.roles && Array.isArray(categoryFilters.roles)) {
        setSelectedRoles(categoryFilters.roles);
      }
    } else if (!categoryParam) {
      // Clear category-based filters if no category param
      // Only clear if we're not in the middle of auto-selecting from q/location/experience params
      if (!qParam && !locationParam && !experienceParam) {
        setSelectedJobTypes([]);
        setSelectedWorkModes([]);
        // Don't clear experience, cities, roles here as they might be set by auto-select useEffect
      }
    }
  }, [locationHook]);

  // Fetch filter options from backend
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const { data } = await api.get("/jobs/filters");
        if (!alive) return;

        if (data.ok && data.filters) {
          setCityOptions(data.filters.cities || []);
          // Prefer structured roles from backend (id + name), fallback to legacy titles (strings)
          if (Array.isArray(data.filters.roles) && data.filters.roles.length) {
            setRoleOptions(data.filters.roles);
          } else if (Array.isArray(data.filters.titles) && data.filters.titles.length) {
            setRoleOptions(
              data.filters.titles.map((name, idx) => ({ id: idx + 1, name }))
            );
          }
          setTagOptions(data.filters.tags || []);
        }
      } catch (err) {
        console.error("Error fetching filters:", err);
        // Continue without filters if endpoint fails
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // Auto-select filters from URL params (q, location, experience) after filter options are loaded
  useEffect(() => {
    // Skip if we're in the process of clearing filters
    if (isClearingFilters.current) {
      isClearingFilters.current = false;
      return;
    }

    const searchParams = new URLSearchParams(locationHook.search);
    const qParam = searchParams.get("q") || "";
    const locationParam = searchParams.get("location") || "";
    const experienceParam = searchParams.get("experience") || "";

    // If no URL params, skip
    if (!qParam && !locationParam && !experienceParam) {
      return;
    }

    // Match job role from q param (wait for roleOptions to be loaded)
    if (qParam && roleOptions.length > 0) {
      const matchedRole = roleOptions.find((role) =>
        role.name.toLowerCase().includes(qParam.toLowerCase()) ||
        qParam.toLowerCase().includes(role.name.toLowerCase())
      );
      if (matchedRole) {
        setSelectedRoles((prev) => {
          if (prev.includes(matchedRole.name)) return prev;
          return [...prev, matchedRole.name];
        });
      }
    }

    // Match city from location param (wait for cityOptions to be loaded)
    if (locationParam && cityOptions.length > 0) {
      const matchedCity = cityOptions.find((city) =>
        city.toLowerCase() === locationParam.toLowerCase() ||
        city.toLowerCase().includes(locationParam.toLowerCase()) ||
        locationParam.toLowerCase().includes(city.toLowerCase())
      );
      if (matchedCity) {
        setSelectedCities((prev) => {
          if (prev.includes(matchedCity)) return prev;
          return [...prev, matchedCity];
        });
      }
    }

    // Map experience param to experience filter value (can be set immediately, no need to wait)
    if (experienceParam) {
      let experienceValue = "";
      switch (experienceParam.toLowerCase()) {
        case "fresher":
          experienceValue = "0";
          break;
        case "mid":
          experienceValue = "0-2";
          break;
        case "senior":
          experienceValue = "2-5"; // Default for "2+ years"
          break;
        default:
          // If it's already a valid experience value, use it directly
          if (EXPERIENCE_OPTIONS.some((opt) => opt.value === experienceParam)) {
            experienceValue = experienceParam;
          }
          break;
      }
      if (experienceValue) {
        setSelectedExperience(experienceValue);
      }
    }
  }, [locationHook.search, cityOptions, roleOptions]);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const searchParams = new URLSearchParams(locationHook.search);
        const categoryParam = searchParams.get("category") || "";
        const apiParams = { limit: 100 };
        if (categoryParam) {
          apiParams.category = categoryParam;
        }
        const { data } = await api.get("/jobs", { params: apiParams });

        if (!alive) return;

        if (data.ok && Array.isArray(data.jobs)) {
          const mapped = data.jobs.map((j) => ({
            id: j._id || j.id,
            roleId: j.roleId != null ? j.roleId : j.role_id != null ? j.role_id : null,
            roleName: j.roleName || j.role_name || "",
            title: j.title || j.jobTitle || "",
            company: j.company || j.companyName || "",
            location: j.location || j.jobLocation || "",
            city: j.city || "", // Store city separately for filtering (from backend)
            type: j.type || j.jobType || "Full Time",
            // Normalize job type for filtering (handle variations like "Full-time", "Full Time", "full-time")
            jobType: (j.type || j.jobType || "full-time").toLowerCase().replace(/\s+/g, "-"),
            workMode: j.workMode || j.mode || j.workType || "Office",
            // Normalize work mode for filtering (handle variations like "Office", "office", "Remote", "remote")
            workModeValue: (j.workMode || j.mode || j.workType || "office").toLowerCase(),
            experience: j.experience || j.experiance || j.exp || "",
            minExperience: j.minExperience != null ? j.minExperience : j.min_experience != null ? j.min_experience : null,
            maxExperience: j.maxExperience != null ? j.maxExperience : j.max_experience != null ? j.max_experience : null,
            skills: j.skills || j.tags || [],
            salary: j.salary || "",
            minSalary: j.minSalary != null ? j.minSalary : j.min_salary != null ? j.min_salary : null,
            maxSalary: j.maxSalary != null ? j.maxSalary : j.max_salary != null ? j.max_salary : null,
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
  }, [locationHook]);

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
        selectedCities.some((city) => {
          // Match against city field or location string
          const jobCity = (job.city || "").toLowerCase();
          const jobLocation = (job.location || "").toLowerCase();
          return jobCity === city.toLowerCase() || jobLocation.includes(city.toLowerCase());
        })
      );
    }

    if (selectedRoles.length) {
      data = data.filter((job) =>
        selectedRoles.some((role) => {
          const roleLc = role.toLowerCase();
          const jobRoleName = (job.roleName || "").toLowerCase();
          const jobTitle = (job.title || "").toLowerCase();
          // Prefer matching against normalized roleName from job_roles,
          // but fall back to title for legacy data
          return (
            (jobRoleName && jobRoleName.includes(roleLc)) ||
            (!jobRoleName && jobTitle.includes(roleLc))
          );
        })
      );
    }

    if (selectedJobTypes.length) {
      data = data.filter((job) => {
        // Normalize job type for comparison
        const normalizedJobType = job.jobType.toLowerCase().replace(/\s+/g, "-");
        return selectedJobTypes.some((type) => {
          const normalizedType = type.toLowerCase().replace(/\s+/g, "-");
          return normalizedJobType === normalizedType || normalizedJobType.includes(normalizedType);
        });
      });
    }

    if (selectedWorkModes.length) {
      data = data.filter((job) => {
        // Normalize work mode for comparison
        const normalizedWorkMode = job.workModeValue.toLowerCase();
        return selectedWorkModes.some((mode) => {
          const normalizedMode = mode.toLowerCase();
          return normalizedWorkMode === normalizedMode;
        });
      });
    }

    if (selectedExperience) {
      data = data.filter((job) => {
        const minExp = job.minExperience != null ? job.minExperience : 0;
        const maxExp = job.maxExperience != null ? job.maxExperience : 100;

        switch (selectedExperience) {
          case "0":
            return minExp === 0 && (maxExp === 0 || maxExp === null);
          case "0-2":
            return minExp >= 0 && maxExp <= 2;
          case "2-5":
            return minExp >= 2 && maxExp <= 5;
          case "5-10":
            return minExp >= 5 && maxExp <= 10;
          case "10+":
            return minExp >= 10;
          default:
            return true;
        }
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
  }, [jobList, searchTerm, selectedCities, selectedRoles, selectedJobTypes, selectedWorkModes, selectedExperience, salaryFilter]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Filter out saved jobs from the list
  const filteredWithoutSaved = useMemo(
    () => filtered.filter((job) => !savedStatus[job.id]),
    [filtered, savedStatus]
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredWithoutSaved.length / pageSize)),
    [filteredWithoutSaved.length]
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginated = useMemo(
    () => filteredWithoutSaved.slice((page - 1) * pageSize, page * pageSize),
    [filteredWithoutSaved, page]
  );

  const startIdx = filteredWithoutSaved.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIdx = (page - 1) * pageSize + paginated.length;

  const hasSidebarFilters =
    selectedCities.length > 0 ||
    selectedRoles.length > 0 ||
    selectedJobTypes.length > 0 ||
    selectedWorkModes.length > 0 ||
    Boolean(selectedExperience) ||
    Boolean(salaryFilter);

  const toggleValue = (value, setFn) => {
    setFn((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    // Set flag to prevent useEffects from re-applying filters
    isClearingFilters.current = true;

    // Clear all filter states
    setSelectedCities([]);
    setSelectedRoles([]);
    setSelectedJobTypes([]);
    setSelectedWorkModes([]);
    setSelectedExperience("");
    setSalaryFilter("");
    setSearchTerm("");

    // Clear all query parameters from URL
    navigate("/jobs", { replace: true });
  };

  // Helper to count jobs for each filter option
  const getJobCountForCity = (city) => {
    return jobList.filter((job) => {
      const jobCity = (job.city || "").toLowerCase();
      const jobLocation = (job.location || "").toLowerCase();
      return jobCity === city.toLowerCase() || jobLocation.includes(city.toLowerCase());
    }).length;
  };

  const getJobCountForRoleName = (roleName) => {
    return jobList.filter((job) =>
      (job.roleName || job.title || "").toLowerCase().includes(roleName.toLowerCase())
    ).length;
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-text-muted mb-1">
                {filteredWithoutSaved.length || jobList.length} jobs near you
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
              {/* Dynamic City Filter */}
              {cityOptions.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-text-dark mb-3">City</p>
                  <div className="flex flex-wrap gap-2">
                    {cityOptions.map((city) => {
                      const active = selectedCities.includes(city);
                      const jobCount = getJobCountForCity(city);
                      if (jobCount === 0) return null; // Hide filters with zero jobs
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
              )}

              {/* Dynamic Job Role Filter (from job_roles) */}
              {roleOptions.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-text-dark mb-3">
                    Job Role(s)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {roleOptions.map((role) => {
                      const label = role.name || role;
                      const active = selectedRoles.includes(label);
                      const jobCount = getJobCountForRoleName(label);
                      if (jobCount === 0) return null; // Hide filters with zero jobs
                      return (
                        <button
                          key={role.id || label}
                          onClick={() => toggleValue(label, setSelectedRoles)}
                          className={`rounded-chip px-3 py-1.5 text-xs font-medium transition-colors ${active
                            ? "bg-primary-50 border-2 border-primary-200 text-primary-700"
                            : "bg-white border-2 border-border text-text-muted hover:bg-gray-50"
                            }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Static Job Type Filter */}
              <div>
                <p className="text-sm font-semibold text-text-dark mb-3">
                  Job Type
                </p>
                <div className="flex flex-wrap gap-2">
                  {JOB_TYPE_OPTIONS.map((option) => {
                    const active = selectedJobTypes.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        onClick={() => toggleValue(option.value, setSelectedJobTypes)}
                        className={`rounded-chip px-3 py-1.5 text-xs font-medium transition-colors ${active
                          ? "bg-primary-50 border-2 border-primary-200 text-primary-700"
                          : "bg-white border-2 border-border text-text-muted hover:bg-gray-50"
                          }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Static Work Mode Filter */}
              <div>
                <p className="text-sm font-semibold text-text-dark mb-3">
                  Work Mode
                </p>
                <div className="flex flex-wrap gap-2">
                  {WORK_MODE_OPTIONS.map((option) => {
                    const active = selectedWorkModes.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        onClick={() => toggleValue(option.value, setSelectedWorkModes)}
                        className={`rounded-chip px-3 py-1.5 text-xs font-medium transition-colors ${active
                          ? "bg-primary-50 border-2 border-primary-200 text-primary-700"
                          : "bg-white border-2 border-border text-text-muted hover:bg-gray-50"
                          }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Static Experience Filter */}
              <div>
                <p className="text-sm font-semibold text-text-dark mb-3">Experience</p>
                <div className="space-y-2">
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2.5 text-sm text-text-dark cursor-pointer hover:text-primary-600 transition-colors"
                    >
                      <input
                        type="radio"
                        name="experience"
                        value={opt.value}
                        checked={selectedExperience === opt.value}
                        onChange={(e) => setSelectedExperience(e.target.value)}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Static Salary Filter */}
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
                Showing {startIdx}–{endIdx} of {filteredWithoutSaved.length} roles
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



                      <div className="flex flex-col gap-3 pt-2 border-t border-border sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap gap-2">
                          <span className="badge badge-primary text-xs">
                            New
                          </span>

                          {r.skills && r.skills.length > 0 && (
                            r.skills.map((skill) => (
                              <span
                                key={skill}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs border border-border text-text-muted bg-gray-50"
                              >
                                {skill}
                              </span>
                            ))
                          )}
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
                disabled={page === totalPages || filteredWithoutSaved.length === 0}
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

