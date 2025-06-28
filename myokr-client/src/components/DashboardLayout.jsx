import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content on the right */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
