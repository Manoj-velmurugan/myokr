import { Link, useLocation, useNavigate } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { path: '/dashboard', label: 'Overview' },
    { path: '/dashboard/departments', label: 'Departments' },
    { path: '/dashboard/teams', label: 'Teams' },
    { path: '/dashboard/users', label: 'Users' },
    { path: '/dashboard/okrs', label: 'OKRs' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between h-screen">
      <div>
        <h2 className="text-2xl font-bold text-purple-600 mb-4">MyOKR</h2>
        <nav className="space-y-2 bg-slate-100 shadow rounded-lg p-4">
          {links.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`block px-4 py-2 rounded transition ${
                location.pathname === path
                  ? 'bg-purple-100 text-purple-700 font-semibold'
                  : 'text-gray-700 hover:text-purple-600'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
