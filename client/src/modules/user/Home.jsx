// Home.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../components/apiconfig/apiconfig";
import { Search } from "lucide-react";
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
    experiance: "Student",
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
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to jobs page with search query
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center mb-6">
      <div>
        <h1 className="text-5xl leading-tight font-extrabold text-slate-900 mb-6">
          Find legit internships & entry-level jobs —{" "}
          <span className="text-orange-600">no spam</span>, just opportunities
        </h1>
        <p className="text-slate-600 mb-6">
          Discover remote, hybrid, and in-office roles curated for students and
          freshers. Apply fast with a smart profile and skill-based search.
        </p>
        <div className="flex gap-4">
          <Link to="/jobs">
            <Button className="shadow">Find Your First Job</Button>
          </Link>
          <Link to="/sign-up">
            <Button variant="secondary">Create Free Profile</Button>
          </Link>
        </div>
      </div>

      <aside>
        <Card className="rounded-2xl shadow-xl">
          <CardContent className="bg-white rounded-2xl">
            <div className="text-lg font-medium mb-3">Search jobs</div>
            <form onSubmit={handleSearch} className="flex gap-2 items-center">
              <div className="flex items-center gap-2 border rounded-md px-3 py-2 w-full">
                <Search size={16} />
                <input
                  className="outline-none w-full text-sm"
                  placeholder="Role, skill or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </CardContent>
        </Card>
      </aside>
    </section>
  );
}

function WhyHireSpark() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div>
          <h2 className="text-4xl font-extrabold mb-4">
            How HireSpark is different
          </h2>
          <p className="text-slate-600 mb-6">
            We focus only on students & freshers—and we verify listings to keep
            out spam. Career resources help you apply smarter and get hired
            faster.
          </p>

          <div className="space-y-4">
            <Card className="rounded-2xl">
              <CardContent className=" rounded-2xl shadow-lg">
                <div className="font-semibold">
                  Higher-quality early-career listings
                </div>
                <div className="opacity-90 mt-1 text-gray-600">
                  Only internships and 0–2 year roles, hand-checked to reduce
                  junk.
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="rounded-2xl shadow-lg">
                <div className="font-semibold">Unlimited career resources</div>
                <div className="opacity-90 mt-1 text-gray-600">
                  Resume templates, interview prep, and skill guides tailored
                  for freshers.
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="shadow-xl rounded-2xl">
                <div className="font-semibold">Save time with smart apply</div>
                <div className="opacity-90 mt-1 text-gray-600">
                  Skill-based profiles, alerts, and one-click apply on select
                  roles.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <aside>
          <Card className="rounded-2xl shadow-sm p-6">
            <CardHeader>
              <CardTitle>Popular searches</CardTitle>
            </CardHeader>
            <CardContent className="rounded-2xl">
              <ul className="grid grid-cols-2 gap-2 text-sm text-slate-700">
                <li>Internships</li>
                <li>Remote Fresher Jobs</li>
                <li>Software (0–2 yrs)</li>
                <li>Data Analyst</li>
                <li>UI/UX Designer</li>
                <li>Business Analyst</li>
                <li>Marketing Associate</li>
                <li>Customer Support</li>
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>
    </section>
  );
}

function JobsTableRow({ job }) {
  return (
    <tr className="border-b">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="text-sm">
            {job.title.charAt(0).toUpperCase() + job.title.slice(1)}
          </div>
        </div>
      </td>

      <td className="px-4 py-3">{job.company}</td>
      <td className="px-4 py-3">{job.location}</td>
      <td className="px-4 py-3">{job.type}</td>
      <td className="px-4 py-3">{job.experiance}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-2 max-w-[170px]">
          {job.tags && job.tags.length ? (
            job.tags.map((t, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs rounded border bg-slate-50 whitespace-nowrap"
              >
                {t}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400">No tags</span>
          )}
        </div>
      </td>

      <td className="px-4 py-3 text-orange-600">{job.posted}</td>
      <td className="px-4 py-3">
        <div className="flex flex-row gap-2 items-center">
          <Button className="px-4 py-2 whitespace-nowrap">Quick Apply</Button>
          <Link
            to={`/jobs/${job.id}`}
            className="text-slate-900 hover:text-orange-600 text-sm border px-3 py-2 rounded-xl bg-slate-100"
          >
            View
          </Link>
        </div>
      </td>
    </tr>
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

  return (
    <main className="max-w-7xl mx-auto px-10 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">
          Featuring fresh internships & entry-level jobs
        </h2>
        <Link
          to="/jobs"
          className="px-4 py-2 border border-orange-500 text-orange-600 rounded-full hover:bg-orange-50"
        >
          Browse all jobs
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-sm border">
        <table className="w-full border bg-white ">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Job Title</th>
              <th className="px-4 py-3 text-left">Company</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Experience</th>
              <th className="px-4 py-3 text-left">Tags</th>
              <th className="px-4 py-3 text-left">Posted</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-10 text-center text-slate-500">
                  Loading jobs...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="p-10 text-center text-rose-600">
                  {error}
                </td>
              </tr>
            ) : jobs.length ? (
              jobs.map((job) => <JobsTableRow key={job.id} job={job} />)
            ) : (
              <tr>
                <td colSpan={8} className="p-10 text-center text-slate-500">
                  No jobs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-10 flex justify-center">
        <Link to="/jobs">
          <Button className="px-6 bg-orange-500 hover:bg-orange-600 text-white">
            Find Your Next Role
          </Button>
        </Link>
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