import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Briefcase, User, Users, Menu } from "lucide-react";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
// Define menu items
  const menuItems = [
    { title: "Dashboard", icon: <LayoutDashboard />, path: "/admin" },
    { title: "Jobs", icon: <Briefcase />, path: "/admin/jobs" },
    { title: "Users", icon: <User />, path: "/admin/users" },
    { title: "Recruiters", icon: <Users />, path: "/admin/recruiters" },
  ];

  return (
    <aside
      className={`h-screen border-r bg-white transition-all duration-300 fixed top-0 left-0 z-50
      ${isOpen ? "w-64" : "w-20"}`}
    >
      {/* Top Section */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1
          className={`text-xl font-bold transition-all duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          Admin Panel
        </h1>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-gray-200 transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Menu Items */}
      <ul className="mt-4 space-y-2 px-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <li key={item.title}>
              <Link
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer
                transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                <span
                  className={`${
                    isOpen ? "block" : "hidden"
                  } text-md font-medium whitespace-nowrap`}
                >
                  {item.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default AdminSidebar;
