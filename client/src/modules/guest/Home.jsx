import React from "react";
import { Helmet } from "react-helmet-async";
import Hero from "./home/Hero";
import Categories from "./home/Categories";
import HowItWorks from "./home/HowItWorks";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Jobion - Connect with Top Companies & Find Your Dream Job</title>
        <meta name="description" content="Discover your next career opportunity on Jobion. Connect with top companies, explore thousands of job listings, and get hired faster. Free job search platform for candidates and recruiters." />
        <meta name="keywords" content="jobs, employment, career, hiring, recruitment, job search, companies, internships, remote work, full-time jobs, part-time jobs" />

        {/* Open Graph */}
        <meta property="og:title" content="Jobion - Connect with Top Companies & Find Your Dream Job" />
        <meta property="og:description" content="Discover your next career opportunity on Jobion. Connect with top companies, explore thousands of job listings, and get hired faster." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.jobion.in/" />

        {/* Twitter */}
        <meta property="twitter:title" content="Jobion - Connect with Top Companies & Find Your Dream Job" />
        <meta property="twitter:description" content="Discover your next career opportunity on Jobion. Connect with top companies, explore thousands of job listings, and get hired faster." />

        {/* Canonical URL */}
        <link rel="canonical" href="https://www.jobion.in/" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-white text-slate-900">
        <main className="flex-1">
          <Hero />
          <Categories />
          <HowItWorks />
        </main>
      </div>
    </>
  );
}

