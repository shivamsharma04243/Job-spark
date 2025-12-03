import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../components/apiconfig/apiconfig";
import { Search, Tag } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

// Home Page Component for JobSpark
const fallbackJobs = [
  {
    id: "s1",
    title: "Software Engineer Intern",
    company: "CloudMints",
    location: "Remote (IN)",
    skills: ["JavaScript", "React", "API"],
    posted: "Today",
    type: "Internship",
    experiance: "Student",
  },
];

// Utility function to convert ISO date to "time ago" format
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

// Hero Section Component
function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to jobs page with search query
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Main Hero Section JSX
  return (
    <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center mb-6">
      <div>
        <h1 className="text-5xl leading-tight font-extrabold text-gray-900 mb-6">
          Find legit internships & entry-level jobs —{" "}
          <span className="text-blue-600">no spam</span>, just opportunities
        </h1>
        <p className="text-gray-600 mb-6">
          Discover remote, hybrid, and in-office roles curated for students and
          freshers. Apply fast with a smart profile and skill-based search.
        </p>
        <div className="flex gap-4">
          <Link to="/jobs">
            <Button className="shadow bg-blue-600 hover:bg-blue-700 text-white">
              Find Your First Job
            </Button>
          </Link>
          <Link to="/sign-up">
            <Button variant="secondary" className="border-blue-300 text-blue-700 hover:bg-blue-50">
              Create Free Profile
            </Button>
          </Link>
        </div>
      </div>

      <aside>
        <Card className="rounded-2xl shadow-xl border border-blue-200">
          <CardContent className="bg-white rounded-2xl p-6">
            <div className="text-lg font-medium mb-3 text-blue-900">Search jobs</div>
            <form onSubmit={handleSearch} className="flex gap-2 items-center">
              <div className="flex items-center gap-2 border border-blue-300 rounded-lg px-3 py-2 w-full focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                <Search size={16} className="text-blue-400" />
                <input
                  className="outline-none w-full text-sm placeholder:text-blue-400"
                  placeholder="Role, skill or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Search
              </Button>
            </form>
          </CardContent>
        </Card>
      </aside>
    </section>
  );
}

// Section explaining why HireSpark is different
function WhyHireSpark() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="text-4xl font-extrabold mb-4 text-gray-900">
            How HireSpark is different
          </h2>
          <p className="text-gray-600 mb-6">
            We focus only on students & freshers—and we verify listings to keep
            out spam. Career resources help you apply smarter and get hired
            faster.
          </p>

          <div className="space-y-4">
            <Card className="rounded-2xl border border-blue-200">
              <CardContent className="rounded-2xl shadow-lg p-6">
                <div className="font-semibold text-blue-900">
                  Higher-quality early-career listings
                </div>
                <div className="mt-1 text-gray-600">
                  Only internships and 0–2 year roles, hand-checked to reduce
                  junk.
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-blue-200">
              <CardContent className="rounded-2xl shadow-lg p-6">
                <div className="font-semibold text-blue-900">Unlimited career resources</div>
                <div className="mt-1 text-gray-600">
                  Resume templates, interview prep, and skill guides tailored
                  for freshers.
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-blue-200">
              <CardContent className="shadow-xl rounded-2xl p-6">
                <div className="font-semibold text-blue-900">Save time with smart apply</div>
                <div className="mt-1 text-gray-600">
                  Skill-based profiles, alerts, and one-click apply on select
                  roles.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <aside>
          <Card className="rounded-2xl shadow-sm border border-blue-200 p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-blue-900">Popular searches</CardTitle>
            </CardHeader>
            <CardContent className="rounded-2xl px-0 pb-0">
              <ul className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <li className="hover:text-blue-600 transition-colors">Internships</li>
                <li className="hover:text-blue-600 transition-colors">Remote Fresher Jobs</li>
                <li className="hover:text-blue-600 transition-colors">Software (0–2 yrs)</li>
                <li className="hover:text-blue-600 transition-colors">Data Analyst</li>
                <li className="hover:text-blue-600 transition-colors">UI/UX Designer</li>
                <li className="hover:text-blue-600 transition-colors">Business Analyst</li>
                <li className="hover:text-blue-600 transition-colors">Marketing Associate</li>
                <li className="hover:text-blue-600 transition-colors">Customer Support</li>
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </section>
  );
}

// Table row component for job listings
function JobsTableRow({ job }) {
  return (
    <tr className="border-b border-blue-100 hover:bg-blue-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium text-gray-900">
            {job.title.charAt(0).toUpperCase() + job.title.slice(1)}
          </div>
        </div>
      </td>

      <td className="px-4 py-3 text-gray-700">{job.company}</td>
      <td className="px-4 py-3 text-gray-700">{job.location}</td>
      <td className="px-4 py-3 text-gray-700">{job.type}</td>
      <td className="px-4 py-3 text-gray-700">{job.experiance}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-2 max-w-[170px]">
          {job.skills && job.skills.length ? (
            job.skills.slice(0, 3).map((skill, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs rounded border border-blue-200 bg-blue-50 text-blue-700 whitespace-nowrap"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">No skills listed</span>
          )}
        </div>
      </td>

      <td className="px-4 py-3 text-blue-600 font-medium">{job.posted}</td>
      <td className="px-4 py-3">
        <div className="flex flex-row gap-2 items-center">
          <Button className="px-4 py-2 whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white">
            Quick Apply
          </Button>
          <Link
            to={`/jobs/${job.id}`}
            className="text-gray-700 hover:text-blue-600 text-sm border border-blue-300 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            View
          </Link>
        </div>
      </td>
    </tr>
  );
}

// Jobs Listing Component
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
            skills: j.skills || [], // Use skills field
            posted: timeAgo(j.createdAt),
            type: j.type,
            experiance: j.experiance || j.experience,
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

  // Jobs Listing JSX
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Featuring fresh internships & entry-level jobs
        </h2>
        <Link
          to="/jobs"
          className="px-4 py-2 border border-blue-500 text-blue-600 rounded-full hover:bg-blue-50 transition-colors whitespace-nowrap"
        >
          Browse all jobs
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-sm border border-blue-200">
        <table className="w-full border bg-white">
          <thead className="bg-blue-50 border-b border-blue-200">
            <tr>
              <th className="px-4 py-3 text-left text-blue-900 font-semibold">Job Title</th>
              <th className="px-4 py-3 text-left text-blue-900 font-semibold">Company</th>
              <th className="px-4 py-3 text-left text-blue-900 font-semibold">Location</th>
              <th className="px-4 py-3 text-left text-blue-900 font-semibold">Type</th>
              <th className="px-4 py-3 text-left text-blue-900 font-semibold">Experience</th>
              <th className="px-4 py-3 text-left text-blue-900 font-semibold">
                <div className="flex items-center gap-2">
                  <Tag size={14} />
                  Skills
                </div>
              </th>
              <th className="px-4 py-3 text-left text-blue-900 font-semibold">Posted</th>
              <th className="px-4 py-3 text-left text-blue-900 font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-10 text-center text-gray-500">
                  Loading jobs...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="p-10 text-center text-red-600">
                  {error}
                </td>
              </tr>
            ) : jobs.length ? (
              jobs.map((job) => <JobsTableRow key={job.id} job={job} />)
            ) : (
              <tr>
                <td colSpan={8} className="p-10 text-center text-gray-500">
                  No jobs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-10 flex justify-center">
        <Link to="/jobs">
          <Button className="px-6 bg-blue-600 hover:bg-blue-700 text-white">
            Find Your Next Role
          </Button>
        </Link>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900">
      <Hero />
      <JobsListing />
      <WhyHireSpark />
    </div>
  );
}