import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import api from '../../../components/apiconfig/apiconfig';

export default function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/auth/authcheck');
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
      localStorage.removeItem('token');
      navigate('/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <MobileHeader setMobileSidebarOpen={setMobileSidebarOpen} />

      <div className="min-h-screen flex">
        {/* Sidebar */}
        <Sidebar 
          sidebarOpen={true}
          mobileSidebarOpen={mobileSidebarOpen}
          userData={userData}
          onToggleSidebar={() => {}}
          onLogout={handleLogout}
          currentPath={location.pathname}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="hidden md:flex items-center justify-between px-8 py-4 border-b border-slate-200 bg-white">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Dashboard</h2>
              <p className="text-xs text-slate-500 mt-1">Overview of your job search activity.</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search jobs..."
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-400 w-48"
              />
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-medium">
                {getUserInitial()}
              </div>
            </div>
          </div>

          {/* Page Content */}
          <section className="p-4 md:p-8">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
}