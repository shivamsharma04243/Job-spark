import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Building2,
  MapPin,
  Briefcase,
  GraduationCap,
  Bookmark,
  BookmarkCheck,
  Tag,
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
            description: j.description || ""
          }));
          setJobList(mapped);
          setFiltered(mapped);

          await checkSavedStatusForJobs(mapped);
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
      data = data.filter((job) => {
        const jobExp = job.experience?.toLowerCase() || "";
        const filterExp = exp.toLowerCase();
        
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

    if (type && type !== "Type") {
      data = data.filter((job) => {
        const jobType = job.type?.toLowerCase() || "";
        const filterType = type.toLowerCase();
        return jobType.includes(filterType);
      });
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
  }, [role, location, exp, type, jobList]);

  const clearFilters = () => {
    setRole("");
    setLocation("");
    setExp("");
    setType("");
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

  const hasActiveFilters = role || location || (exp && exp !== "Experience") || (type && type !== "Type");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {role ? `Search Results for "${role}"` : "Find Your Dream Job"}
            </h1>
            <p className="text-gray-600 text-lg">
              {filtered.length} {filtered.length === 1 ? 'job' : 'jobs'} found
              {role && ` for "${role}"`}
            </p>
          </div>
          
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 px-6"
            >
              Clear All Filters
            </Button>
          )}
        </div>

        {/* Search Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-6 rounded-2xl border border-blue-200 shadow-lg mb-8">
          <Input
            placeholder="Role, skill, or company"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
          />

          <Input
            placeholder="Location (Remote, Bengaluru...)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
          />

          <select
            className="rounded-lg border border-blue-300 p-3 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
            value={exp}
            onChange={(e) => setExp(e.target.value)}
          >
            <option value="">Experience Level</option>
            <option value="Student">Student</option>
            <option value="Fresher">Fresher (0 yrs)</option>
            <option value="1-2 years">1–2 yrs</option>
          </select>

          <select
            className="rounded-lg border border-blue-300 p-3 text-sm focus:border-blue-500 focus:ring-blue-500 bg-white"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Job Type</option>
            <option value="Internship">Internship</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        {/* Jobs Table */}
        <div className="overflow-x-auto rounded-2xl border border-blue-200 bg-white shadow-lg">
          <table className="w-full text-sm">
            <thead className="bg-blue-50 text-blue-900 border-b border-blue-200">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-sm">Job Title</th>
                <th className="px-6 py-4 text-left font-semibold text-sm">Company</th>
                <th className="px-6 py-4 text-left font-semibold text-sm">Location</th>
                <th className="px-6 py-4 text-left font-semibold text-sm">Type</th>
                <th className="px-6 py-4 text-left font-semibold text-sm">Experience</th>
                <th className="px-6 py-4 text-left font-semibold text-sm">
                  <div className="flex items-center gap-2">
                    <Tag size={14} />
                    Skills
                  </div>
                </th>
                <th className="px-6 py-4 text-left font-semibold text-sm">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                      Loading jobs...
                    </div>
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    <div className="space-y-2">
                      <p className="text-lg font-medium">
                        {hasActiveFilters 
                          ? "No jobs found matching your criteria" 
                          : "No jobs available at the moment"
                        }
                      </p>
                      <p className="text-sm text-gray-400">
                        {hasActiveFilters 
                          ? "Try adjusting your filters or search terms" 
                          : "Check back later for new opportunities"
                        }
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((r) => (
                  <tr key={r.id} className="border-b border-blue-100 hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 align-middle">
                      <div className="font-medium text-gray-900">{r.title}</div>
                    </td>

                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Building2 size={16} className="text-blue-500" /> 
                        {r.company}
                      </div>
                    </td>

                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin size={16} className="text-blue-500" /> 
                        {r.location}
                      </div>
                    </td>

                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Briefcase size={16} className="text-blue-500" /> 
                        {r.type}
                      </div>
                    </td>

                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-2 text-gray-700">
                        <GraduationCap size={16} className="text-blue-500" /> 
                        {r.experience}
                      </div>
                    </td>

                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-wrap gap-2 max-w-xs">
                        {r.skills && r.skills.slice(0, 4).map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="rounded-full text-xs border-blue-200 bg-blue-50 text-blue-700 px-2 py-1"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {r.skills && r.skills.length > 4 && (
                          <Badge variant="outline" className="rounded-full text-xs border-blue-200 bg-blue-50 text-blue-700">
                            +{r.skills.length - 4} more
                          </Badge>
                        )}
                        {(!r.skills || r.skills.length === 0) && (
                          <span className="text-xs text-gray-400 italic">No skills listed</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 align-middle">
                      <div className="flex gap-3">
                        <a href={`/jobs/${r.id}`} className="flex-1">
                          <Button variant="outline" className="w-full text-sm border-blue-300 text-blue-700 hover:bg-blue-50">
                            View Details
                          </Button>
                        </a>
                        <Button className="flex-1 text-sm bg-blue-600 hover:bg-blue-700 text-white">
                          Quick Apply
                        </Button>
                        <Button 
                          variant="outline" 
                          className="p-2 border-blue-300 hover:bg-blue-50"
                          onClick={() => toggleSaveJob(r.id, savedStatus[r.id])}
                          title={savedStatus[r.id] ? "Unsave job" : "Save job"}
                        >
                          {savedStatus[r.id] ? (
                            <BookmarkCheck size={16} className="text-blue-600" />
                          ) : (
                            <Bookmark size={16} className="text-blue-500" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              className="rounded-lg border border-blue-300 px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const active = page === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                      active
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              className="rounded-lg border border-blue-300 px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}