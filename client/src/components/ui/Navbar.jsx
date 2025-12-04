import React, { useState, useEffect, useRef } from "react";
import { Sparkles, User, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import api from "../../components/apiconfig/apiconfig";
import SignInModal from "../../modules/auth/SignInModal";

export default function Navbar() {
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
        const res = await api.get("/auth/me");
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
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white text-slate-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 md:py-4 flex items-center justify-between">
          {/* Logo */}
          <div>
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white grid place-items-center shadow-md">
                <Sparkles size={20} />
              </div>
              <b className="text-xl font-bold tracking-tight">
                Hire<span className="text-blue-600">Spark</span>
              </b>
            </Link>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-600">
            <Link to="/" className="hover:text-blue-600 transition-colors font-medium">
              Home
            </Link>
            <Link
              to="/jobs"
              className="hover:text-blue-600 transition-colors font-medium"
            >
              Browse Jobs
            </Link>
            <Link
              to="/post-job"
              className="hover:text-blue-600 transition-colors font-medium"
            >
              Post a Job
            </Link>
            <Link
              to="/companies"
              className="hover:text-blue-600 transition-colors font-medium"
            >
              Companies
            </Link>
            <Link
              to="/contact"
              className="hover:text-blue-600 transition-colors font-medium"
            >
              Contact
            </Link>
          </nav>

          {/* Buttons / Profile */}
          <div className="flex gap-3 items-center">
            {!loading && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-haspopup="true"
                  aria-expanded={open}
                >
                  <div className="h-9 w-9 rounded-full bg-slate-100 grid place-items-center text-sm font-semibold text-slate-700">
                    {user.username ? (
                      user.username.charAt(0).toUpperCase()
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-slate-800">
                    {user.name || user.fullname || user.username}
                  </span>
                </button>

                {open && (
                  <div className="absolute right-0 mt-3 w-72 bg-white text-slate-900 rounded-xl shadow-2xl p-5 z-50 border border-slate-200">
                    <div className="mb-4">
                      <div className="text-xs text-slate-500">Name</div>
                      <div className="font-semibold text-lg">
                        {user.name || user.fullname || user.username}
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-xs text-slate-500">Username</div>
                      <div className="font-medium text-sm">{user.username}</div>
                    </div>
                    <div className="mb-4">
                      <div className="text-xs text-slate-500">Role</div>
                      <div className="font-medium text-sm">{user.role || "-"}</div>
                    </div>
                    <div className="mb-4">
                      <div className="text-xs text-slate-500">Member since</div>
                      <div className="font-medium text-sm">
                        {formatCreatedDate(user)}
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-xs text-slate-500">Last login</div>
                      <div className="font-medium text-sm">
                        {formatLoginTime(user)}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-200 space-y-3">
                      <Link
                        to="/profile"
                        onClick={() => setOpen(false)}
                        className="block w-full text-left px-4 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors font-medium text-sm"
                      >
                        View Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors font-medium text-sm text-white"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Candidate = user (popup) */}
                <Button
                  variant="ghost"
                  className="text-slate-800 hover:bg-slate-100 transition-colors hidden sm:flex"
                  onClick={() => handleOpenAuth("user")}
                >
                  Candidate Login
                </Button>

                {/* Recruiter (popup) */}
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
                  onClick={() => handleOpenAuth("recruiter")}
                >
                  Recruiter Login
                </Button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200">
            <nav className="px-6 py-4 space-y-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-blue-600 transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                to="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-blue-600 transition-colors font-medium"
              >
                Browse Jobs
              </Link>
              <Link
                to="/post-job"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-blue-600 transition-colors font-medium"
              >
                Post a Job
              </Link>
              <Link
                to="/companies"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-blue-600 transition-colors font-medium"
              >
                Companies
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-blue-600 transition-colors font-medium"
              >
                Contact
              </Link>
              {!loading && !user && (
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <Button
                    variant="ghost"
                    className="w-full text-left text-slate-700 hover:text-blue-600 hover:bg-slate-50"
                    onClick={() => handleOpenAuth("user")}
                  >
                    Candidate Login
                  </Button>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    onClick={() => handleOpenAuth("recruiter")}
                  >
                    Recruiter Login
                  </Button>
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