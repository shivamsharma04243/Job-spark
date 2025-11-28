import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  
  // Get search query from URL parameters
  const locationHook = useLocation();

  useEffect(() => {
    // Read search parameter from URL when component loads
    const searchParams = new URLSearchParams(locationHook.search);
    const searchQuery = searchParams.get('search') || '';
    if (searchQuery) {
      setRole(searchQuery);
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
          // Use the exact field names from your database response
          const mapped = data.jobs.map((j) => ({
            id: j._id || j.id,
            title: j.title || j.jobTitle || "",
            company: j.company || j.companyName || "",
            location: j.location || j.jobLocation || "",
            type: j.type || j.jobType || "",
            mode: j.mode || j.workMode || j.workType || "",
            experience: j.experience || j.experiance || j.exp || "",
            tags: j.tags || j.skills || [],
            salary: j.salary || "",
            description: j.description || ""
          }));
          setJobList(mapped);
          setFiltered(mapped);
          console.log("Jobs loaded:", mapped); // Debug log
        }
      } catch (err) {
        console.error("Error loading jobs:", err);
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
    if (jobList.length === 0) return;

    let data = [...jobList];

    const roleTrim = role.trim().toLowerCase();
    const locationTrim = location.trim().toLowerCase();

    console.log("Filtering with:", { roleTrim, locationTrim, exp, mode }); // Debug log

    // Role filter - search in title, company, and tags
    if (roleTrim !== "") {
      data = data.filter((job) => {
        const titleMatch = job.title?.toLowerCase().includes(roleTrim) || false;
        const companyMatch = job.company?.toLowerCase().includes(roleTrim) || false;
        const tagsMatch = job.tags?.some(tag => 
          tag?.toLowerCase().includes(roleTrim)
        ) || false;
        const descriptionMatch = job.description?.toLowerCase().includes(roleTrim) || false;
        
        return titleMatch || companyMatch || tagsMatch || descriptionMatch;
      });
    }

    // Location filter
    if (locationTrim !== "") {
      data = data.filter((job) =>
        job.location?.toLowerCase().includes(locationTrim)
      );
    }

    // Experience filter
    if (exp && exp !== "Experience") {
      data = data.filter((job) => {
        const jobExp = job.experience?.toLowerCase() || "";
        const filterExp = exp.toLowerCase();
        
        // Flexible matching for experience
        if (filterExp === "student") {
          return jobExp.includes("student") || jobExp.includes("fresher") || jobExp.includes("intern") || jobExp.includes("0");
        } else if (filterExp === "fresher (0 yrs)") {
          return jobExp.includes("fresher") || jobExp.includes("0") || jobExp.includes("entry");
        } else if (filterExp === "1–2 yrs") {
          return jobExp.includes("1") || jobExp.includes("2") || jobExp.includes("1-2") || jobExp.includes("1+");
        }
        return jobExp.includes(filterExp);
      });
    }

    // Work mode filter
    if (mode && mode !== "Work mode") {
      data = data.filter((job) => {
        const jobMode = job.mode?.toLowerCase() || "";
        const filterMode = mode.toLowerCase();
        return jobMode.includes(filterMode);
      });
    }

    console.log("Filtered results:", data.length); // Debug log
    setFiltered(data);
    setPage(1);
    
    // Update URL with current search parameters
    const params = new URLSearchParams();
    if (roleTrim) params.set('search', roleTrim);
    if (locationTrim) params.set('location', locationTrim);
    if (exp && exp !== "Experience") params.set('experience', exp);
    if (mode && mode !== "Work mode") params.set('mode', mode);
    
    const newUrl = params.toString() ? `/jobs?${params.toString()}` : '/jobs';
    window.history.replaceState({}, '', newUrl);
  };

  // Call handleSearch whenever any filter changes
  useEffect(() => {
    handleSearch();
  }, [role, location, exp, mode, jobList]);

  const clearFilters = () => {
    setRole("");
    setLocation("");
    setExp("");
    setMode("");
    window.history.replaceState({}, '', '/jobs');
  };

  const pageSize = 4;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(filtered.length / pageSize);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    } else if (totalPages === 0) {
      setPage(1);
    }
  }, [filtered, totalPages, page]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Check if any filters are active
  const hasActiveFilters = role || location || (exp && exp !== "Experience") || (mode && mode !== "Work mode");

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">                                                                                                                                     
      <div className="flex justify-between items-center mb-1">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold">
            {role ? `Search Results for "${role}"` : "Find Jobs"}
          </h1>
          <p className="text-slate-600 mb-4">
            {filtered.length} {filtered.length === 1 ? 'job' : 'jobs'} found
            {role && ` for "${role}"`}
          </p>
        </div>
        
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            onClick={clearFilters}
            className="mb-4"
          >
            Clear Filters
          </Button>
        )}
      </div>

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
          <option value="">Experience</option>
          <option value="Student">Student</option>
          <option value="Fresher">Fresher (0 yrs)</option>
          <option value="1-2 years">1–2 yrs</option>
        </select>

        <select
          className="rounded-xl border p-2 text-sm"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="">Work mode</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Office">Office</option>
        </select>

        <Button onClick={handleSearch} className="hidden md:inline-flex">
          Search
        </Button>
      </div>

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 mb-2">
          Showing {filtered.length} of {jobList.length} jobs | Page {page} of {totalPages}
        </div>
      )}

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
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-slate-500">
                  Loading jobs...
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-slate-500">
                  {hasActiveFilters 
                    ? "No jobs found matching your criteria. Try adjusting your filters." 
                    : "No jobs available at the moment."
                  }
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
                      <MapPin size={14} /> {r.location}
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
                      <GraduationCap size={14} /> {r.experience}
                    </div>
                  </td>

                  <td className="px-3 py-2 align-middle">
                    <div className="flex flex-wrap gap-1">
                      {r.tags && r.tags.map((t, index) => (
                        <Badge
                          key={index}
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