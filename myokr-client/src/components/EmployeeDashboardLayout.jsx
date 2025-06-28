import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import EmployeeSidebar from './employeeSidebar';

const EmployeeDashboardLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <EmployeeSidebar/>

      {/* Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeDashboardLayout;
