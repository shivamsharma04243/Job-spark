import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Building,
  UserPlus,
  Bell,
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function RecruiterSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  // Check if current route is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Menu items with icons
  const menuItems = [
    { 
      title: "Dashboard", 
      icon: <LayoutDashboard size={20} />, 
      path: "/recruiter-dashboard" 
    },
    { 
      title: "Post Job", 
      icon: <Briefcase size={20} />, 
      path: "/create-job" 
    },
    { 
      title: "Jobs", 
      icon: <Briefcase size={20} />, 
      path: "/job-posted" 
    },
    { 
      title: "Applicants", 
      icon: <Users size={20} />, 
      path: "/recruiter/jobs" 
    },
    { 
      title: "Company Profile", 
      icon: <Building size={20} />, 
      path: "/recruiter-profile" 
    },
    { 
      title: "Talent Hire", 
      icon: <UserPlus size={20} />, 
      path: "/talent-hire" 
    },
    { 
      title: "Notifications", 
      icon: <Bell size={20} />, 
      path: "/notifications" 
    },
  ];

  return (
    <aside
      className={`h-screen bg-white border-r border-slate-200 transition-all duration-300 fixed top-0 left-0 z-50
      ${isOpen ? "w-64" : "w-20"}`}
    >
      {/* Logo Section */}
      <div className="px-4 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className={`flex items-center gap-3 transition-all ${isOpen ? "opacity-100" : "opacity-0 hidden"}`}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">HS</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">HireSpark</h1>
            <p className="text-xs text-slate-500">Recruiter</p>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {menuItems.map((item) => (
          <Link 
            key={item.title}
            to={item.path} 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
              ${isActive(item.path) 
                ? 'bg-slate-900 text-white font-medium' 
                : 'text-slate-700 hover:bg-slate-100'
              }
              ${!isOpen ? "justify-center" : ""}
            `}
            title={!isOpen ? item.title : ""}
          >
            <span className={`flex-shrink-0 ${isActive(item.path) ? 'text-white' : 'text-slate-600'}`}>
              {item.icon}
            </span>
            <span className={`${isOpen ? "block" : "hidden"} text-sm whitespace-nowrap`}>
              {item.title}
            </span>
          </Link>
        ))}
      </nav>

      {/* Bottom Section - Logout */}
      <div className="px-2 py-4 border-t border-slate-200">
        <button 
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all duration-200
            ${!isOpen ? "justify-center" : ""}
          `}
          title={!isOpen ? "Logout" : ""}
        >
          <LogOut size={18} />
          <span className={`${isOpen ? "block" : "hidden"} whitespace-nowrap`}>
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}