import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';
import { jwtDecode } from 'jwt-decode';

function EmployeeDashboard() {
  const [user, setUser] = useState(null);
  const [okrCount, setOkrCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded);

        const userId = decoded.id;



        // Fetch user info (team + department)
        const userRes = await axios.get(`/employee/${userId}`);
        setUser(userRes.data);

        // Fetch assigned OKRs
        const okrRes = await axios.get(`/okrs/assigned/${userId}`);
        setOkrCount(okrRes.data.length);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Employee Dashboard</h2>
      <h2 className="text-3xl font-bold mb-2 text-gray-800">
  Hello, {user?.name?.split(' ')[0] || 'Employee'} 👋
</h2>
<p className="text-gray-600 mb-6 text-lg">
  Here’s a quick look at your team and OKRs.
</p>


      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <InfoCard title="Department" value={user?.team?.department?.name || 'N/A'} color="bg-blue-100 text-blue-800" />
        <InfoCard title="Team" value={user?.team?.name || 'N/A'} color="bg-green-100 text-green-800" />
        <InfoCard title="Assigned OKRs" value={okrCount} color="bg-purple-100 text-purple-800" />
      </div>
    </div>
  );
}

function InfoCard({ title, value, color }) {
  return (
    <div className={`p-6 rounded-lg shadow-md ${color} text-center`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

export default EmployeeDashboard;
