import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, User, Menu, X } from 'lucide-react';
import api from '../../../components/apiconfig/apiconfig';

export default function CandidateHeader() {
  const [userData, setUserData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/auth/session');
      if (response.data?.user) {
        setUserData(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const getUserInitial = () => {
    if (userData?.full_name) {
      return userData.full_name.charAt(0).toUpperCase();
    }
    return userData?.username?.charAt(0).toUpperCase() || 'U';
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      navigate('/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatCreatedDate = (u) => {
    if (!u) return '-';
    const d = u.created_at || u.createdAt || u.created || u.createdAtDate || u.createdAtUTC;
    try {
      const date = d ? new Date(d) : null;
      return date ? date.toLocaleDateString() : '-';
    } catch (e) {
      return '-';
    }
  };

  const formatLoginTime = (u) => {
    if (!u) return '-';
    const d = u.loginAt || u.last_login || u.lastLogin || u.loggedInAt;
    try {
      const date = d ? new Date(d) : null;
      return date ? date.toLocaleString() : '-';
    } catch (e) {
      return '-';
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'Find Jobs' },
    { path: '/dashboard/saved', label: 'Saved Jobs' },
    { path: '/dashboard/applied', label: 'Applications' },
    { path: '/dashboard/profile', label: 'Profile' },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
          >
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Hire<span className="text-blue-600">Spark</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
                )}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-sm font-semibold text-white shadow-sm">
                  {userData ? getUserInitial() : <User size={18} />}
                </div>
              </button>

              {dropdownOpen && userData && (
                <div className="absolute right-0 mt-2.5 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-5 z-50 transform transition-all duration-200 ease-out opacity-100 translate-y-0">
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Name</div>
                        <div className="font-semibold text-gray-900 text-base">
                          {userData.name || userData.full_name || userData.fullname || userData.username || '-'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Username</div>
                        <div className="text-sm text-gray-700 font-medium">{userData.username || userData.email || '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Role</div>
                        <div className="text-sm">
                          <span className="inline-flex px-2.5 py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-md text-xs font-semibold border border-blue-200">
                            {userData.role || 'candidate'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Member since</div>
                        <div className="text-sm text-gray-700 font-medium">{formatCreatedDate(userData)}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Last login</div>
                        <div className="text-sm text-gray-700 font-medium">{formatLoginTime(userData)}</div>
                      </div>
                    </div>
                    
                    <div className="pt-5 mt-5 border-t border-gray-200 space-y-2.5">
                      <Link
                        to="/dashboard/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="block w-full text-center px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 font-semibold text-sm border border-blue-200 shadow-sm hover:shadow-md"
                      >
                        View Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold text-sm text-white shadow-sm hover:shadow-md"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
