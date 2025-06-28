import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';

import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Teams from './pages/Teams';
import Users from './pages/Users';
import OKRs from './pages/OKRs';

import DashboardLayout from './components/DashboardLayout';
import EmployeeDashboardLayout from './components/EmployeeDashboardLayout';
import EmployeeDashboard from './pages/employee/employeeDashboard';
import EmployeeOKRs from './pages/employee/EmployeeOKRs';

import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Panel Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="departments" element={<Departments />} />
          <Route path="teams" element={<Teams />} />
          <Route path="users" element={<Users />} />
          <Route path="okrs" element={<OKRs />} />
        </Route>

        {/* Employee Panel Routes */}
        <Route
          path="/employee"
          element={
            <PrivateRoute>
              <EmployeeDashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="okrs" element={<EmployeeOKRs />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
