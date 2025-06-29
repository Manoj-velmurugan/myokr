import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import EmployeeSidebar from './employeeSidebar';
import { Menu } from 'lucide-react';

const EmployeeDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Auto-close sidebar on route change (for mobile)
  useEffect(() => {
    if (window.innerWidth < 640) {
      setSidebarOpen(false);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex bg-gray-100 relative">
      {/* Hamburger for mobile */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-full shadow-md"
        onClick={toggleSidebar}
      >
        <Menu className="h-6 w-6 text-gray-700" />
      </button>

      {/* Sidebar */}
      <div
        className={`z-40 sm:z-0 ${
          sidebarOpen
            ? 'fixed top-0 left-0 w-64 h-full bg-white shadow-lg transition-transform transform translate-x-0'
            : 'fixed top-0 left-0 w-64 h-full bg-white shadow-lg transition-transform transform -translate-x-full'
        } sm:relative sm:translate-x-0 sm:flex-shrink-0`}
      >
        <EmployeeSidebar />
      </div>

      {/* Overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 sm:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <main className="flex-1 p-4 sm:p-6 mt-10 sm:mt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeDashboardLayout;
