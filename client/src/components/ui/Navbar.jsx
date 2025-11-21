import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Search, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./button";
import api from "../apiconfig/apiconfig.jsx";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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
    const d = u.created_at || u.createdAt || u.created || u.createdAtDate || u.createdAtUTC;
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
      navigate("/sign-in");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-orange-500 text-white grid place-items-center">
            <Sparkles size={18} />
          </div>
          <b className="text-lg">HireSpark</b>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center gap-10 text-sm text-slate-300">
          <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/jobs" className="hover:text-white">Jobs</Link>
          <Link to="/companies" className="hover:text-white">Companies</Link>
          <Link to="/career-kit" className="hover:text-white">Career Kit</Link>
          <Link to="/why" className="hover:text-white">Why HireSpark</Link>
        </nav>

        {/* Buttons / Profile */}
        <div className="flex gap-3 items-center">
          {!loading && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-800"
                aria-haspopup="true"
                aria-expanded={open}
              >
                <div className="h-8 w-8 rounded-full bg-slate-700 grid place-items-center text-sm">
                  {user.username ? user.username.charAt(0).toUpperCase() : <User size={16} />}
                </div>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800 text-white rounded shadow-lg p-4 z-50">
                  <div className="mb-3">
                    <div className="text-sm text-slate-300">Name</div>
                    <div className="font-medium">{user.name || user.fullname || user.username}</div>
                  </div>
                  <div className="mb-3">
                    <div className="text-sm text-slate-300">Username</div>
                    <div className="font-medium">{user.username}</div>
                  </div>
                  <div className="mb-3">
                    <div className="text-sm text-slate-300">Role</div>
                    <div className="font-medium">{user.role || '-'}</div>
                  </div>
                  <div className="mb-3">
                    <div className="text-sm text-slate-300">Member since</div>
                    <div className="font-medium">{formatCreatedDate(user)}</div>
                  </div>
                  <div className="mb-3">
                    <div className="text-sm text-slate-300">Logged in</div>
                    <div className="font-medium">{formatLoginTime(user)}</div>
                  </div>
                  <div className="pt-2 border-t border-slate-700 space-y-2">
                    <Link to="/profile" onClick={()=>setOpen(false)} className="block w-full text-left px-3 py-2 rounded bg-slate-700 hover:bg-slate-600">View profile</Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded bg-red-600 hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/sign-in">
                <Button variant="ghost" className="text-white hover:bg-slate-800">
                  Sign in
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Get Job Alerts
                </Button>
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
