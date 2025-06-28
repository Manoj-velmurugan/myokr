import { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { jwtDecode } from 'jwt-decode';

function MyOKRs() {
  const [okrs, setOkrs] = useState([]);

  useEffect(() => {
    const fetchOKRs = async () => {
      try {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const res = await axios.get(`/okrs/assigned/${userId}`);
        setOkrs(res.data);
      } catch (err) {
        console.error('Error loading OKRs:', err);
      }
    };

    fetchOKRs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Assigned OKRs</h2>

      <div className="space-y-4">
        {okrs.length === 0 ? (
          <p className="text-gray-600">No OKRs assigned yet.</p>
        ) : (
          okrs.map((okr) => (
            <div key={okr._id} className="bg-white p-4 rounded shadow">
              <h3 className="text-xl font-semibold text-purple-700">{okr.objective}</h3>
              <ul className="list-disc list-inside mt-2 text-gray-700">
                {okr.keyResults.map((kr, i) => (
                  <li key={i}>{kr}</li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyOKRs;
