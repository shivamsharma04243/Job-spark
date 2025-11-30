// src/modules/admin/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-6 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
