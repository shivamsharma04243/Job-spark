import React, { useState, useEffect, useRef } from "react";
import { Sparkles, User, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../components/apiconfig/apiconfig";
import SignInModal from "../../../modules/auth/candidate-recruiter/SignInModal";

/**
 * Guest Navbar - For public pages
 */
export default function GuestNavbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // auth popup
  const [authOpen, setAuthOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("user"); // "user" (candidate) | "recruiter"

  useEffect(() => {
    let mounted = true;

    async function fetchProfile() {
      try {
        const res = await api.get("/auth/session");
        if (mounted) setUser(res.data.user || null);
      } catch (err) {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function formatCreatedDate(u) {
    if (!u) return "-";
    const d =
      u.created_at ||
      u.createdAt ||
      u.created ||
      u.createdAtDate ||
      u.createdAtUTC;
    try {
      const date = d ? new Date(d) : null;
      return date ? date.toLocaleDateString() : "-";
    } catch (e) {
      return "-";
    }
  }

  function formatLoginTime(u) {
    if (!u) return "-";
    const d = u.loginAt || u.last_login || u.lastLogin || u.loggedInAt;
    try {
      const date = d ? new Date(d) : null;
      return date ? date.toLocaleString() : "-";
    } catch (e) {
      return "-";
    }
  }

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
      setUser(null);
      setOpen(false);
      setMobileMenuOpen(false);
      navigate("/sign-in");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  function handleOpenAuth(role) {
    setSelectedRole(role); // "user" or "recruiter"
    setAuthOpen(true);
    setMobileMenuOpen(false); // Close mobile menu if open
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-white text-text-dark shadow-sm backdrop-blur-sm bg-white/95">
        <div className="container-custom py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 sm:gap-3 hover:opacity-90 transition-opacity flex-shrink-0"
            >
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-primary-500 text-white grid place-items-center shadow-soft flex-shrink-0">
                <Sparkles size={18} className="sm:w-5 sm:h-5" />
              </div>
              <b className="text-lg sm:text-xl font-bold tracking-tight">
                Hire<span className="text-primary-500">Spark</span>
              </b>
            </Link>

            {/* Desktop Navigation Menu */}
            <nav className="hidden md:flex items-center gap-2 lg:gap-3">
              <Link
                to="/"
                className="px-3 lg:px-4 py-2 rounded-button text-sm font-semibold text-text-muted hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/jobs"
                className="px-3 lg:px-4 py-2 rounded-button text-sm font-semibold text-text-muted hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                Browse Jobs
              </Link>
              <Link
                to="/sign-in?role=recruiter&redirect=post-job"
                className="px-3 lg:px-4 py-2 rounded-button text-sm font-semibold text-text-muted hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                Post a Job
              </Link>
            </nav>

            {/* Buttons / Profile */}
            <div className="flex gap-2 sm:gap-3 items-center">
              {!loading && user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setOpen((v) => !v)}
                    className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-button hover:bg-gray-100 transition-colors"
                    aria-haspopup="true"
                    aria-expanded={open}
                  >
                    <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-primary-50 grid place-items-center text-sm font-semibold text-primary-700 flex-shrink-0">
                      {user.username ? (
                        user.username.charAt(0).toUpperCase()
                      ) : (
                        <User size={16} className="sm:w-[18px] sm:h-[18px]" />
                      )}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-text-dark">
                      {user.name || user.fullname || user.username}
                    </span>
                  </button>

                  {open && (
                    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white text-text-dark rounded-xl shadow-large p-5 z-50 border border-border">
                      <div className="mb-4">
                        <div className="text-xs text-text-muted mb-1">Name</div>
                        <div className="font-semibold text-base">
                          {user.name || user.fullname || user.username || "-"}
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="text-xs text-text-muted mb-1">Username</div>
                        <div className="font-medium text-sm">{user.username || user.email || "-"}</div>
                      </div>
                      <div className="mb-4">
                        <div className="text-xs text-text-muted mb-1">Role</div>
                        <div className="font-medium text-sm capitalize">{user.role || "-"}</div>
                      </div>
                      <div className="mb-4">
                        <div className="text-xs text-text-muted mb-1">Member since</div>
                        <div className="font-medium text-sm">
                          {formatCreatedDate(user)}
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="text-xs text-text-muted mb-1">Last login</div>
                        <div className="font-medium text-sm">
                          {formatLoginTime(user)}
                        </div>
                      </div>
                      <div className="pt-4 border-t border-border space-y-2">
                        <Link
                          to="/profile"
                          onClick={() => setOpen(false)}
                          className="block w-full text-left px-4 py-2.5 rounded-button bg-gray-50 hover:bg-gray-100 transition-colors font-medium text-sm"
                        >
                          View Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 rounded-button bg-error-500 hover:bg-error-600 transition-colors font-medium text-sm text-white"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Candidate Login - Navigate to sign-in page */}
                  <Link
                    to="/sign-in?role=candidate"
                    className="hidden sm:inline-flex btn btn-ghost btn-sm"
                  >
                    Candidate Login
                  </Link>

                  {/* Recruiter Login - Navigate to sign-in page */}
                  <Link
                    to="/sign-in?role=recruiter"
                    className="btn btn-primary btn-sm"
                  >
                    <span className="hidden sm:inline">Recruiter Login</span>
                    <span className="sm:hidden">Login</span>
                  </Link>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="md:hidden p-2 rounded-button hover:bg-gray-100 transition-colors flex-shrink-0"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-border animate-in slide-in-from-top">
            <nav className="px-4 sm:px-6 py-4 space-y-3">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-text-dark hover:text-primary-600 transition-colors font-medium text-base"
              >
                Home
              </Link>
              <Link
                to="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-text-dark hover:text-primary-600 transition-colors font-medium text-base"
              >
                Browse Jobs
              </Link>
              <Link
                to="/sign-in?role=recruiter&redirect=post-job"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-text-dark hover:text-primary-600 transition-colors font-medium text-base"
              >
                Post a Job
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-text-dark hover:text-primary-600 transition-colors font-medium text-base"
              >
                Contact
              </Link>
              {!loading && !user && (
                <div className="pt-4 border-t border-border space-y-2">
                  <Link
                    to="/sign-in?role=candidate"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2.5 rounded-button text-sm font-semibold text-primary-600 border-2 border-primary-500 hover:bg-primary-50 transition-colors"
                  >
                    Candidate Login
                  </Link>
                  <Link
                    to="/sign-in?role=recruiter"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2.5 rounded-button btn-primary btn-sm"
                  >
                    Recruiter Login
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Auth popup modal */}
      {authOpen && (
        <SignInModal
          role={selectedRole}
          onClose={() => setAuthOpen(false)}
        />
      )}
    </>
  );
}

