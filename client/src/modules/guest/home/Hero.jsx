import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, ChevronRight } from "lucide-react";
import { PRIMARY } from "./data";
import api from "../../../components/apiconfig/apiconfig";
import { citiesByState } from "../../../constants/locationData";

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

export default function Hero() {
  const [sectionRef, sectionVisible] = useFadeInOnScroll();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [chips, setChips] = useState([]);
  const [activeField, setActiveField] = useState("title");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [jobRoles, setJobRoles] = useState([]); // Dynamic job roles from API
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [cities, setCities] = useState([]); // All cities from locationData
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const navigate = useNavigate();

  // Fetch job roles from API on component mount
  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        const { data } = await api.get("/jobs/roles");
        if (data.ok && data.roles) {
          setJobRoles(data.roles);
        }
      } catch (err) {
        console.error("Error fetching job roles:", err);
        // Fallback to some default roles if API fails
        setJobRoles([
          { id: 1, name: "Frontend Developer" },
          { id: 2, name: "Backend Developer" },
          { id: 3, name: "Full Stack Engineer" },
          { id: 4, name: "Product Manager" },
          { id: 5, name: "Marketing Manager" },
          { id: 6, name: "Data Analyst" },
          { id: 7, name: "UI/UX Designer" },
        ]);
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchJobRoles();
  }, []);

  // Load all cities from locationData plus remote option
  useEffect(() => {
    const loadCities = () => {
      const allCities = Object.values(citiesByState).flat();
      // Add remote option for remote jobs
      allCities.unshift("Remote");
      setCities(allCities);
    };

    loadCities();
  }, []);

  // Convert job roles to suggestions array for filtering
  const suggestions = useMemo(() => {
    return jobRoles.map(role => role.name);
  }, [jobRoles]);

  const filteredSuggestions = useMemo(() => {
    if (!searchTerm.trim() || loadingRoles) return [];
    const lower = searchTerm.toLowerCase();
    return suggestions
      .filter((s) => s.toLowerCase().includes(lower))
      .slice(0, 8); // Show up to 8 suggestions
  }, [searchTerm, suggestions, loadingRoles]);

  const filteredLocationSuggestions = useMemo(() => {
    if (!location.trim()) return [];
    const lower = location.toLowerCase();
    return cities
      .filter((city) => city.toLowerCase().includes(lower))
      .slice(0, 8); // Show up to 8 location suggestions
  }, [location, cities]);

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

  const handleLocationSuggestionClick = (value) => {
    setLocation(value);
    addChip(value, "location");
    setShowLocationSuggestions(false);
  };

  return (
    <section
      ref={sectionRef}
      className={`relative bg-white transition-all duration-1000 ease-out min-h-[85vh] sm:min-h-screen flex items-center justify-center ${sectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 section-padding">
        <div className="max-w-5xl mx-auto w-full flex flex-col items-center justify-center text-center gap-6 sm:gap-8">
          <div className="space-y-4 sm:space-y-6 w-full flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-text-dark">
              Trusted Opportunities for{" "}
              <span className="text-primary-500">Fresh Talent</span>
            </h1>

            {/* Advanced search */}
            <div className="w-full bg-gray-100 rounded-card border border-border">
              <div className="p-4 sm:p-5 md:p-6">
                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div className="relative sm:col-span-2 lg:col-span-1">
                      <label className="label text-text-muted">
                        Job title or skill
                      </label>
                      <div className="relative flex items-center gap-2.5 rounded-input px-3.5 py-2.5 sm:py-3 bg-white border border-border focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
                        <Search size={18} className="text-primary-500 flex-shrink-0" strokeWidth={2} />
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
                          placeholder={loadingRoles ? "Loading job roles..." : "e.g. Delivery, Telecaller"}
                          disabled={loadingRoles}
                          className="flex-1 bg-transparent text-sm sm:text-base outline-none border-none text-text-dark placeholder:text-text-muted disabled:opacity-50"
                        />
                      </div>
                      {showSuggestions && filteredSuggestions.length > 0 && (
                        <div className="absolute z-20 mt-1 w-full bg-white rounded-lg shadow-large text-sm sm:text-base max-h-52 overflow-auto border border-border">
                          {filteredSuggestions.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSuggestionClick(s);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-primary-50 transition-colors text-text-dark"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="label text-text-muted">
                        City / area
                      </label>
                      <div className="relative flex items-center gap-2.5 rounded-input px-3.5 py-2.5 sm:py-3 bg-white border border-border focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
                        <MapPin size={18} className="text-primary-500 flex-shrink-0" strokeWidth={2} />
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => {
                            setLocation(e.target.value);
                            setActiveField("location");
                            setShowLocationSuggestions(true);
                          }}
                          onFocus={() => {
                            setActiveField("location");
                            setShowLocationSuggestions(true);
                          }}
                          placeholder="e.g. Mumbai, Delhi, Remote"
                          className="flex-1 bg-transparent text-sm sm:text-base outline-none border-none text-text-dark placeholder:text-text-muted"
                        />
                      </div>
                      {showLocationSuggestions && filteredLocationSuggestions.length > 0 && (
                        <div className="absolute z-20 mt-1 w-full bg-white rounded-lg shadow-large text-sm sm:text-base max-h-52 overflow-auto border border-border">
                          {filteredLocationSuggestions.map((city) => (
                            <button
                              key={city}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleLocationSuggestionClick(city);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-primary-50 transition-colors text-text-dark"
                            >
                              {city}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="label text-text-muted">
                        Experience
                      </label>
                      <select
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        onFocus={() => setActiveField("experience")}
                        className="w-full rounded-input px-3.5 py-2.5 sm:py-3 bg-white border border-border text-sm sm:text-base outline-none text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all cursor-pointer"
                      >
                        <option value="">Any</option>
                        <option value="fresher">Fresher / Entry</option>
                        <option value="mid">0–2 years</option>
                        <option value="senior">2+ years</option>
                      </select>
                    </div>
                  </div>

                  {/* Filter chips */}
                  {chips.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {chips.map((chip) => (
                        <button
                          key={chip.key}
                          type="button"
                          onClick={() => removeChip(chip.key)}
                          className="inline-flex items-center gap-1.5 rounded-chip px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-colors bg-primary-50 text-primary-700 hover:bg-primary-100"
                        >
                          <span>{chip.value}</span>
                          <span className="text-xs">✕</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col items-center gap-3">
                    <button
                      type="submit"
                      className="btn btn-primary btn-md sm:btn-lg px-8 sm:px-10"
                    >
                      Search Jobs
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

