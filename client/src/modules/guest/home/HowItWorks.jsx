import React, { useEffect, useRef, useState } from "react";
import { BG } from "./data";

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

export default function HowItWorks() {
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
      style={{ backgroundColor: '#FFFFFF' }}
      className={`transition-all duration-1000 ease-out section-padding ${sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
    >
      <div className="container-custom">
        <div className="max-w-2xl mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-text-dark mb-2">
            How it works
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-text-muted">
            Same simple flow for job seekers and recruiters. No confusing steps.
          </p>
        </div>

        <div className="mb-6 sm:mb-8 inline-flex rounded-full bg-white border-2 border-border p-1 shadow-soft">
          <button
            type="button"
            onClick={() => setTab("seekers")}
            className={`px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold rounded-full transition-all ${tab === "seekers"
                ? "text-white shadow-soft bg-primary-500"
                : "text-text-muted hover:text-primary-600"
              }`}
          >
            For Job Seekers
          </button>
          <button
            type="button"
            onClick={() => setTab("recruiters")}
            className={`px-4 sm:px-6 py-2 text-sm sm:text-base font-semibold rounded-full transition-all ${tab === "recruiters"
                ? "text-white shadow-soft bg-primary-500"
                : "text-text-muted hover:text-primary-600"
              }`}
          >
            For Recruiters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="card card-hover"
            >
              <div className="p-4 sm:p-5 space-y-3">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold bg-primary-50 text-primary-700 border-2 border-primary-100">
                  {index + 1}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold leading-snug text-text-dark">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-text-muted">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

