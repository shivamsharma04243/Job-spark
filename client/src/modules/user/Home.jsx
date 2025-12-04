// Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../components/apiconfig/apiconfig";
import { Search, MapPin, Clock, Briefcase } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const fallbackJobs = [
  {
    id: "s1",
    title: "Software Engineer Intern",
    company: "CloudMints",
    location: "Remote (IN)",
    tags: ["JavaScript", "React", "API"],
    posted: "Today",
    type: "Internship",
    experience: "Student",
  },
];

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

function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-orange-50 to-white border-b border-slate-200">
   <div className="max-w-7xl mx-auto px-6 py-20 md:py-24 grid md:grid-cols-2 gap-16 items-center">
  <div className="space-y-6">
    
    {/* Small Tag */}
    <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
      Early Career Opportunities
    </p>

    {/* Main Heading */}
    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight">
      Find legit internships & entry-level jobs —
      <span className="text-orange-600"> no spam </span>,
      just opportunities
    </h1>

    {/* Description */}
    <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl">
      Discover remote, hybrid, and in-office roles curated for students and freshers. 
      Apply fast with a smart profile and skill-based search.
    </p>

    {/* Buttons */}
    <div className="flex flex-wrap gap-4">
      <Link to="/jobs">
        <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg font-semibold shadow-lg">
          Explore Jobs
        </Button>
      </Link>

      <Link to="/sign-up">
        <Button
          variant="outline"
          className="border-2 border-slate-300 text-slate-800 hover:bg-slate-50 px-8 py-4 text-lg font-semibold"
        >
          Join for Free
        </Button>
      </Link>
    </div>

  </div>



        <aside className="w-full">
          <Card className="border border-slate-200 rounded-2xl shadow-xl bg-white">
            <CardHeader className="pb-6">
              <CardTitle className="text-lg font-bold text-slate-900">
                Quick Job Search
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-4 border border-slate-300 rounded-xl px-5 py-4 w-full bg-slate-50 shadow-inner">
                  <Search size={20} className="text-slate-500" />
                  <input
                    className="outline-none w-full text-lg text-slate-900 placeholder:text-slate-400 bg-transparent"
                    placeholder="Search by role, skill, or company"
                  />
                </div>
                <Button className="bg-slate-900 hover:bg-slate-800 text-lg px-6 py-4 font-semibold shadow-lg">
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </section>
  );
}

function WhyHireSpark() {
  return (
    <section className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-start">
        <div className="space-y-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
              Why HireSpark Stands Out for Early Talent
            </h2>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl">
              Designed exclusively for students and freshers, we ensure every listing is vetted, spam-free, and focused on real career growth.
            </p>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-slate-50 to-white">
              <CardContent className="py-6 px-8">
                <div className="text-xl font-bold text-slate-900 mb-3">
                  Premium Early-Career Listings
                </div>
                <p className="text-base text-slate-600">
                  Curated internships and 0–2 year roles with emphasis on authenticity and relevance.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-slate-50 to-white">
              <CardContent className="py-6 px-8">
                <div className="text-xl font-bold text-slate-900 mb-3">
                  Actionable Career Resources
                </div>
                <p className="text-base text-slate-600">
                  Access resume builders, interview guides, and skill-building roadmaps tailored for beginners.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-slate-50 to-white">
              <CardContent className="py-6 px-8">
                <div className="text-xl font-bold text-slate-900 mb-3">
                  Seamless Application Process
                </div>
                <p className="text-base text-slate-600">
                  Use your profile for quick applies, get notifications, and enjoy streamlined flows for faster hiring.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <aside>
          <Card className="border border-slate-200 rounded-2xl shadow-xl bg-white">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-bold text-slate-900">
                Trending Searches
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-8">
              <ul className="grid grid-cols-2 gap-4 text-base text-slate-700">
                <li className="hover:text-orange-600 cursor-pointer transition-colors">Internships</li>
                <li className="hover:text-orange-600 cursor-pointer transition-colors">Remote Fresher Roles</li>
                <li className="hover:text-orange-600 cursor-pointer transition-colors">Software (0–2 yrs)</li>
                <li className="hover:text-orange-600 cursor-pointer transition-colors">Data Analyst</li>
                <li className="hover:text-orange-600 cursor-pointer transition-colors">UI/UX Designer</li>
                <li className="hover:text-orange-600 cursor-pointer transition-colors">Business Analyst</li>
                <li className="hover:text-orange-600 cursor-pointer transition-colors">Marketing Associate</li>
                <li className="hover:text-orange-600 cursor-pointer transition-colors">Customer Support</li>
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </section>
  );
}
function JobCard({ job }) {
  return (
    <Card className="group border border-slate-200 rounded-2xl shadow-md hover:shadow-2xl hover:border-orange-200 transition-all duration-300 bg-white overflow-hidden cursor-pointer">
      <CardContent className="p-6">
        <div className="space-y-5">
          {/* Header with logo placeholder */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <Briefcase size={24} className="text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-orange-600 transition-colors line-clamp-2">
                {job.title.charAt(0).toUpperCase() + job.title.slice(1)}
              </h3>
              <p className="text-base font-medium text-slate-600">{job.company}</p>
            </div>
          </div>

          {/* Enhanced meta information */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-1.5">
              <MapPin size={16} className="text-slate-400" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase size={16} className="text-slate-400" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={16} className="text-slate-400" />
              <span>{job.posted}</span>
            </div>
          </div>

          {/* Improved tags section */}
          <div className="min-h-[32px]">
            {job.tags && job.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {job.tags.slice(0, 3).map((t, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 text-xs font-semibold rounded-full bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors"
                  >
                    {t}
                  </span>
                ))}
                {job.tags.length > 3 && (
                  <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-600">
                    +{job.tags.length - 3} more
                  </span>
                )}
              </div>
            ) : (
              <span className="text-sm text-slate-400 italic">No skills listed</span>
            )}
          </div>

          {/* Refined action buttons */}
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <Button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2.5 font-semibold shadow-sm hover:shadow-md transition-all">
              Apply Now
            </Button>
            <Link
              to={`/jobs/${job.id}`}
              className="flex-1 flex items-center justify-center text-slate-700 hover:text-orange-600 hover:bg-orange-50 border border-slate-300 hover:border-orange-300 py-2.5 rounded-lg font-semibold transition-all"
            >
              Details
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function JobsListing() {
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

        if (data.ok && Array.isArray(data.jobs)) {
          const mapped = data.jobs.map((j) => ({
            id: j.id,
            title: j.title,
            company: j.company,
            location: j.location || "Remote",
            tags: j.tags || [],
            posted: timeAgo(j.createdAt),
            type: j.type,
            experience: j.experience || j.experiance,
            logoPath: j.logoPath,
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
    <main className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Featured Internships & Entry-Level Roles
          </h2>
          <Link
            to="/jobs"
            className="inline-flex items-center justify-center px-8 py-4 text-lg border-2 border-orange-500 text-orange-600 rounded-full hover:bg-orange-50 font-semibold transition-colors"
          >
            View All Jobs
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="border border-slate-200 rounded-2xl shadow-lg animate-pulse">
                <CardContent className="p-6 space-y-4">
                  <div className="h-6 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-slate-200 rounded-full w-16"></div>
                    <div className="h-6 bg-slate-200 rounded-full w-20"></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-10 bg-slate-200 rounded flex-1"></div>
                    <div className="h-10 bg-slate-200 rounded flex-1"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-2xl text-rose-600 font-semibold">{error}</p>
          </div>
        ) : jobs.length ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-slate-500 font-semibold">No jobs found.</p>
          </div>
        )}

        <div className="mt-16 flex justify-center">
          <Button className="px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white text-lg font-semibold shadow-lg">
            Discover Your Next Opportunity
          </Button>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Hero />
      <JobsListing />
      <WhyHireSpark />
    </div>
  );
}
