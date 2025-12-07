import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../components/apiconfig/apiconfig";
import {
  Search,
  MapPin,
  Clock,
  Briefcase,
  Building2,
  Users,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  UserPlus,
  Send,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import homeIllustration from "../../assets/home.svg";

// THEME CONSTANTS
const PRIMARY_BLUE = "#0066CC";
const LIGHT_GREY_BG = "#F5F5F5";
const CTA_GREEN = "#0052A3";

// SIMPLE FALLBACK DATA
const fallbackJobs = [
  {
    id: "s1",
    title: "Senior Frontend Engineer",
    company: "CloudMints",
    location: "Remote",
    salary: "₹18L – ₹28L",
    type: "Full-time",
    posted: "Today",
  },
  {
    id: "s2",
    title: "Product Marketing Manager",
    company: "LaunchPad",
    location: "Bengaluru",
    salary: "₹12L – ₹18L",
    type: "Full-time",
    posted: "2d ago",
  },
];

const jobCategories = [
  {
    id: "work-from-home",
    label: "Work from home",
    count: 260000,
    icon: <HomeIcon />,
    headline: "2,60,000+ Vacancies",
    description: "Work from home jobs",
  },
  {
    id: "part-time",
    label: "Part Time",
    count: 1960000,
    icon: <Clock size={22} />,
    headline: "19,60,000+ Vacancies",
    description: "Part time jobs for flexible hours",
  },
  {
    id: "women",
    label: "Jobs for Women",
    count: 720000,
    icon: <Users size={22} />,
    headline: "7,20,000+ Vacancies",
    description: "Safe & women‑friendly workplaces",
  },
  {
    id: "fresher",
    label: "Fresher jobs",
    count: 1170000,
    icon: <UserPlus size={22} />,
    headline: "11,70,000+ Vacancies",
    description: "No / less experience required",
  },
  {
    id: "delivery-sales",
    label: "Delivery / Sales",
    count: 540000,
    icon: <Send size={22} />,
    headline: "5,40,000+ Vacancies",
    description: "Delivery partner & field sales roles",
  },
  {
    id: "office-data-entry",
    label: "Office job / Data entry",
    count: 380000,
    icon: <Building2 size={22} />,
    headline: "3,80,000+ Vacancies",
    description: "Back‑office, computer & data work",
  },
  {
    id: "telecaller",
    label: "Telecaller",
    count: 290000,
    icon: <Briefcase size={22} />,
    headline: "2,90,000+ Vacancies",
    description: "Inbound / outbound calling jobs",
  },
  {
    id: "internship-paid",
    label: "Internship (Paid)",
    count: 210000,
    icon: <ArrowRight size={22} />,
    headline: "2,10,000+ Vacancies",
    description: "Stipend based internships",
  },
  {
    id: "internship-unpaid",
    label: "Internship (Unpaid / Student)",
    count: 160000,
    icon: <Briefcase size={22} />,
    headline: "1,60,000+ Vacancies",
    description: "Learning focused roles for students",
  },
];

function HomeIcon() {
  return (
    <div className="w-4 h-4 rounded-sm border border-blue-500 bg-blue-50 flex items-center justify-center">
      <span className="w-2 h-2 border-b-2 border-l-2 border-blue-500 rotate-[-45deg]" />
    </div>
  );
}

// UTIL
function timeAgo(iso) {
  if (!iso) return "";
  const created = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now - created) / 1000);
  if (diff < 60) return `${diff}s ago`;
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

// SIMPLE SCROLL FADE-IN HOOK
function useFadeInOnScroll() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

// SEARCH + FILTER CHIPS + AUTOCOMPLETE
function Hero() {
  const [sectionRef, sectionVisible] = useFadeInOnScroll();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [experience, setExperience] = useState("");
  const [chips, setChips] = useState([]);
  const [activeField, setActiveField] = useState("title");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  const suggestions = useMemo(
    () => [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Engineer",
      "Product Manager",
      "Marketing Manager",
      "Data Analyst",
      "UI/UX Designer",
    ],
    []
  );

  const filteredSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const lower = searchTerm.toLowerCase();
    return suggestions.filter((s) => s.toLowerCase().includes(lower)).slice(0, 5);
  }, [searchTerm, suggestions]);

  const addChip = (label, field) => {
    if (!label) return;
    const value = label.trim();
    if (!value) return;
    const key = `${field}:${value}`;
    if (chips.some((c) => c.key === key)) return;
    setChips((prev) => [...prev, { key, field, value }]);
  };

  const removeChip = (key) => {
    setChips((prev) => prev.filter((c) => c.key !== key));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (location) params.set("location", location);
    if (category) params.set("category", category);
    if (experience) params.set("experience", experience);
    chips.forEach((chip) => {
      params.append(`chip_${chip.field}`, chip.value);
    });
    navigate(`/jobs?${params.toString()}`);
  };

  const handleSuggestionClick = (value) => {
    setSearchTerm(value);
    addChip(value, "title");
    setShowSuggestions(false);
  };

  return (
    <section
      ref={sectionRef}
      className={`relative bg-white transition-all duration-1000 ease-out ${
        sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-10 md:py-12 lg:py-16 lg:min-h-[calc(100vh-120px)] grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left copy */}
        <div className="space-y-5">
          <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-3 py-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Jobs for you. Talent for companies.
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Find local & remote jobs{" "}
            <span className="text-blue-600">in minutes</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl">
            Search by city, role or skill. Apply in a few taps. No confusing
            steps. Real openings from verified companies, not spam.
          </p>

          {/* Advanced search */}
          <Card className="border border-slate-200 shadow-lg rounded-2xl">
            <CardContent className="p-4 sm:p-5 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid md:grid-cols-4 gap-3">
                  <div className="relative">
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">
                      Job title or skill
                    </label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50">
                      <Search size={18} className="text-slate-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setActiveField("title");
                          setShowSuggestions(true);
                        }}
                        onFocus={() => {
                          setActiveField("title");
                          setShowSuggestions(true);
                        }}
                        placeholder="e.g. Delivery, Telecaller"
                        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                      />
                    </div>
                    {showSuggestions && filteredSuggestions.length > 0 && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg text-sm max-h-52 overflow-auto">
                        {filteredSuggestions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSuggestionClick(s);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-slate-50"
                          >
                            {s}
                          </button>
                        ))}
    </div>
                    )}
  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">
                      City / area
                    </label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50">
                      <MapPin size={18} className="text-slate-400" />
                  <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onFocus={() => setActiveField("location")}
                        placeholder="e.g. Delhi, Remote"
                        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
      </div>

          <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      onFocus={() => setActiveField("category")}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 text-sm outline-none text-slate-700"
                    >
                      <option value="">All categories</option>
                      {jobCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
          </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">
                      Experience
                    </label>
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      onFocus={() => setActiveField("experience")}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 text-sm outline-none text-slate-700"
                    >
                      <option value="">Any</option>
                      <option value="fresher">Fresher / Entry</option>
                      <option value="mid">2–5 years</option>
                      <option value="senior">5+ years</option>
                    </select>
                  </div>
                </div>

                {/* Filter chips */}
                {chips.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {chips.map((chip) => (
                      <button
                        key={chip.key}
                        type="button"
                        onClick={() => removeChip(chip.key)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100 hover:bg-blue-100 transition-colors"
                      >
                        <span>{chip.value}</span>
                        <span className="text-[10px] text-blue-500">✕</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      className="flex-1 sm:flex-none sm:px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm hover:shadow-md transition-all"
                      style={{ backgroundColor: PRIMARY_BLUE }}
                    >
                      Search Jobs
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setSearchTerm("");
                        setLocation("");
                        setCategory("");
                        setExperience("");
                        setChips([]);
                      }}
                      variant="outline"
                      className="hidden sm:inline-flex border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </form>
              </CardContent>
            </Card>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/post-job" className="flex-1">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md flex items-center justify-center gap-2 text-sm"
                style={{ backgroundColor: CTA_GREEN }}
              >
                Post a Job
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/jobs" className="flex-1">
              <Button className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 font-semibold flex items-center justify-center gap-2 text-sm">
                Browse Jobs
                <ChevronRight size={16} />
              </Button>
            </Link>
          </div>
        </div>

        {/* Right side – hero illustration image */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-full max-w-xl lg:max-w-2xl lg:mt-12">
            <img
              src={homeIllustration}
              alt="People exploring new career opportunities"
              className="w-full h-auto rounded-3xl object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// FEATURED JOB CARD
function JobCard({ job }) {
  return (
    <Card className="group border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 bg-white overflow-hidden">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
            <Building2 size={20} />
            </div>
            <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-700 line-clamp-2">
              {job.title}
              </h3>
            <p className="text-sm text-slate-600">{job.company}</p>
            </div>
          </div>

        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-50 border border-slate-100">
            <MapPin size={14} className="text-slate-400" />
            {job.location}
          </span>
          {job.salary && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-50 border border-slate-100">
              ₹ {job.salary}
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700">
            <Briefcase size={14} className="text-blue-500" />
            {job.type}
                  </span>
          {job.posted && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-50 border border-slate-100">
              <Clock size={14} className="text-slate-400" />
              {job.posted}
                  </span>
            )}
          </div>

        <div className="flex gap-2 pt-2">
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm hover:shadow-md"
            style={{ backgroundColor: CTA_GREEN }}
          >
            Quick Apply
            </Button>
            <Link
              to={`/jobs/${job.id}`}
            className="flex-1 inline-flex items-center justify-center text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-100 transition-colors"
            >
            View Details
            </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function FeaturedJobs() {
  const [sectionRef, sectionVisible] = useFadeInOnScroll();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchJobs() {
      try {
        setLoading(true);
        const { data } = await api.get("/jobs", { params: { limit: 8 } });
        if (!mounted) return;
        if (data?.ok && Array.isArray(data.jobs)) {
          const mapped = data.jobs.map((j) => ({
            id: j.id,
            title: j.title,
            company: j.company,
            location: j.location || "Remote",
            salary: j.salaryRange || j.salary || "",
            type: j.type || "Full-time",
            posted: timeAgo(j.createdAt),
          }));
          setJobs(mapped);
        } else {
          setJobs(fallbackJobs);
        }
      } catch (err) {
        setError(err.message);
        setJobs(fallbackJobs);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`bg-white transition-all duration-1000 ease-out ${
        sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Latest jobs near you
          </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Simple cards with title, company and salary so you can decide quickly.
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm border border-blue-200 text-blue-700 rounded-full hover:bg-blue-50 font-semibold transition-colors"
          >
            View all jobs
            <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card
                key={i}
                className="border border-slate-200 rounded-2xl shadow-sm animate-pulse bg-white"
              >
                <CardContent className="p-5 space-y-4">
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/3" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-slate-200 rounded-full w-16" />
                    <div className="h-6 bg-slate-200 rounded-full w-20" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-slate-200 rounded flex-1" />
                    <div className="h-8 bg-slate-200 rounded flex-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-sm text-rose-600 font-semibold">
              {error || "Could not load jobs right now."}
            </p>
          </div>
        ) : jobs.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-sm text-slate-500 font-semibold">
              No jobs found at the moment. Check back soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// HOW IT WORKS – TABS
function HowItWorks() {
  const [sectionRef, sectionVisible] = useFadeInOnScroll();
  const [tab, setTab] = useState("seekers");
  const seekerSteps = [
    { title: "Search", desc: "Find jobs by city, role or skill." },
    { title: "Apply", desc: "Send your details in a few taps." },
    { title: "Interview", desc: "Talk to the recruiter or company." },
    { title: "Get hired", desc: "Join and start earning faster." },
  ];
  const recruiterSteps = [
    { title: "Post job", desc: "Share your opening with basic details." },
    { title: "Review", desc: "See matching candidates in one list." },
    { title: "Interview", desc: "Call or message shortlisted profiles." },
    { title: "Hire", desc: "Close the role and grow your team." },
  ];
  const steps = tab === "seekers" ? seekerSteps : recruiterSteps;

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: LIGHT_GREY_BG }}
      className={`transition-all duration-1000 ease-out ${
        sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-12 md:py-16">
        <div className="max-w-2xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            How it works
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Same simple flow for job seekers and recruiters. No confusing steps.
          </p>
        </div>

        <div className="mb-6 inline-flex rounded-full bg-white border border-slate-200 p-1">
          <button
            type="button"
            onClick={() => setTab("seekers")}
            className={`px-4 sm:px-6 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-colors ${
              tab === "seekers"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            For Job Seekers
          </button>
          <button
            type="button"
            onClick={() => setTab("recruiters")}
            className={`px-4 sm:px-6 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-colors ${
              tab === "recruiters"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            For Recruiters
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <Card
              key={step.title}
              className="border border-slate-200 rounded-2xl bg-white shadow-sm"
            >
              <CardContent className="p-5 space-y-3">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                  {index + 1}
                </div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// CATEGORIES
function Categories() {
  const [sectionRef, sectionVisible] = useFadeInOnScroll();
  const navigate = useNavigate();

  const handleClick = (categoryId) => {
    navigate(`/jobs?category=${encodeURIComponent(categoryId)}`);
  };

  return (
    <section
      ref={sectionRef}
      className={`bg-slate-50 transition-all duration-1000 ease-out ${
        sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Browse by category
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Tap a card to see jobs only from that category.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleClick(cat.id)}
              className="group text-left"
            >
              <Card className="h-full border border-slate-200 rounded-2xl shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all bg-slate-50/60">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-700 border border-blue-100">
                    {cat.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {cat.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {cat.count.toLocaleString()} open roles
                    </p>
                  </div>
                  <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// WHY CHOOSE US
function WhyChooseUs() {
  const [sectionRef, sectionVisible] = useFadeInOnScroll();
  const items = [
    {
      title: "Simple job search",
      desc: "Clean cards and filters so you can decide quickly.",
    },
    {
      title: "Smart filters",
      desc: "Filter by city, category, salary range and more.",
    },
    {
      title: "Verified companies",
      desc: "We try to show jobs from trusted brands and partners.",
    },
    {
      title: "Quick apply",
      desc: "Save your basic details and reuse them for each job.",
    },
    {
      title: "Profile & resume help",
      desc: "Get simple tips to improve your profile and resume.",
    },
    {
      title: "Alerts for new jobs",
      desc: "Turn on alerts so you never miss a matching job.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className={`bg-white transition-all duration-1000 ease-out ${
        sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-12 md:py-16">
        <div className="max-w-2xl mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Why people like using JobSpark
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Short steps, clear cards and simple language for every user.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <Card
              key={item.title}
              className="border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <CardContent className="p-5 space-y-3">
            <CheckCircle2 className="text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA SECTION
function DualCTA() {
  return (
    <section className="bg-gradient-to-r from-blue-50 via-sky-50 to-blue-100 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-10 md:py-14">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <p className="text-xs font-semibold tracking-[0.22em] uppercase text-blue-700/70">
              Ready to get started?
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-slate-900">
              One platform. Two journeys. Built for modern hiring.
            </h2>
            <p className="text-sm sm:text-base text-slate-700 max-w-xl">
              Whether you’re scaling your team or planning your next move, JobSpark
              keeps everything organised, fast, and human.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="bg-white border border-blue-100 rounded-2xl shadow-lg">
              <CardContent className="p-5 space-y-3">
                <p className="text-xs font-semibold text-blue-700 uppercase">
                  For recruiters
                </p>
                <h3 className="text-lg font-bold text-slate-900">Start hiring today</h3>
                <p className="text-xs text-slate-600">
                  Publish roles, manage applicants, and collaborate with your team.
                </p>
                <Link to="/post-job">
                  <Button
                    className="mt-2 w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold flex items-center justify-center gap-1.5"
                  >
                    Start Hiring
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white border border-blue-100 rounded-2xl shadow-lg">
              <CardContent className="p-5 space-y-3">
                <p className="text-xs font-semibold text-blue-700 uppercase">
                  For candidates
                </p>
                <h3 className="text-lg font-bold text-slate-900">Upload your resume</h3>
                <p className="text-xs text-slate-600">
                  Build a profile once and apply to multiple roles in minutes.
                </p>
                <Link to="/profile/upload-resume">
                  <Button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-1.5">
                    Upload Resume
                    <ChevronRight size={16} />
          </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <main className="flex-1">
      <Hero />
        <Categories />
        <FeaturedJobs />
        <HowItWorks />
        <WhyChooseUs />
        <DualCTA />
      </main>
    </div>
  );
}