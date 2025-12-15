import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, MapPin, Clock, Users, UserPlus, Send, Building2, Briefcase, ArrowRight } from "lucide-react";
import { jobCategories } from "./data";

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

const iconMap = {
  home: MapPin,
  clock: Clock,
  users: Users,
  userPlus: UserPlus,
  send: Send,
  building: Building2,
  briefcase: Briefcase,
  arrowRight: ArrowRight,
};

export default function Categories() {
  const [sectionRef, sectionVisible] = useFadeInOnScroll();
  const navigate = useNavigate();

  const handleClick = (categoryId) => {
    navigate(`/jobs?category=${encodeURIComponent(categoryId)}`);
  };

  return (
    <section
      ref={sectionRef}
      className={`transition-all duration-1000 ease-out section-padding ${sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      style={{ backgroundColor: '#F7FAFF' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-text-dark">
              Browse by category
            </h2>
            <p className="text-sm sm:text-base leading-relaxed mt-2 text-text-muted">
              Tap a card to see jobs only from that category.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {jobCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleClick(cat.id)}
              className="group text-left"
            >
              <div className="h-full card card-hover group-hover:-translate-y-1 transition-all duration-200">
                <div className="p-4 sm:p-5 flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-button bg-primary-50 flex items-center justify-center border-2 border-primary-100 flex-shrink-0">
                    {iconMap[cat.icon] ? (
                      React.createElement(iconMap[cat.icon], {
                        size: 24,
                        className: "text-primary-600",
                        strokeWidth: 2
                      })
                    ) : (
                      <Briefcase size={24} className="text-primary-600" strokeWidth={2} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base sm:text-lg font-semibold leading-snug text-text-dark">
                      {cat.label}
                    </p>
                    <p className="text-sm text-text-muted mt-1">
                      {cat.count.toLocaleString()} open roles
                    </p>
                  </div>
                  <ChevronRight size={20} className="text-primary-500 transition-transform group-hover:translate-x-1 flex-shrink-0" strokeWidth={2} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

