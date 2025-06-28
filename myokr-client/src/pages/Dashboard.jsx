import { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';

function Dashboard() {
  const [stats, setStats] = useState({ users: 0, teams: 0, departments: 0, okrs: 0 });
  const [recentOkrs, setRecentOkrs] = useState([]);
  const [loading, setLoading] = useState(true); // 🌀 Loading state

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('No token found');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [usersRes, teamsRes, departmentsRes, okrsRes] = await Promise.all([
          axios.get('/users', config),
          axios.get('/teams', config),
          axios.get('/departments', config),
          axios.get('/okrs', config),
        ]);

        setStats({
          users: usersRes.data.length,
          teams: teamsRes.data.length,
          departments: departmentsRes.data.length,
          okrs: okrsRes.data.length,
        });

        const recent = okrsRes.data.slice(-5).reverse();
        setRecentOkrs(recent);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false); // 🔁 Done loading
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Users" count={stats.users} color="blue" />
          <StatCard title="Teams" count={stats.teams} color="green" />
          <StatCard title="Departments" count={stats.departments} color="yellow" />
          <StatCard title="OKRs" count={stats.okrs} color="purple" />
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Recently Added OKRs</h3>
          <div className="max-h-80 overflow-y-auto pr-2">
            <ul className="space-y-4">
              {recentOkrs.map((okr) => (
                <li key={okr._id} className="border p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-purple-700">{okr.objective}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Team: {okr.team?.name || 'Unassigned'}
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
                    {okr.keyResults.map((kr, i) => (
                      <li key={i}>{kr}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, count, color }) {
  const bgColor = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
  }[color];

  return (
    <div className={`p-4 rounded-lg shadow-md ${bgColor} text-center`}>
      <p className="text-lg font-semibold">{title}</p>
      <p className="text-3xl font-bold mt-2">{count}</p>
    </div>
  );
}

export default Dashboard;
