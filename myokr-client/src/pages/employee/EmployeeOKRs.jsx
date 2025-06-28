import { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';
import { jwtDecode } from 'jwt-decode';

function EmployeeOKRs() {
  const [okrs, setOkrs] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchOKRs = async () => {
      try {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const id = decoded.id;
        setUserId(id);

        const res = await axios.get(`/okrs/assigned/${id}`);
        setOkrs(res.data);
      } catch (err) {
        console.error('Error fetching employee OKRs:', err);
      }
    };

    fetchOKRs();
  }, []);

  const handleMarkCompleted = async (okrId) => {
    try {
      await axios.put(`/okrs/${okrId}/status`, { status: 'completed' });
      setOkrs(prev =>
        prev.map(okr =>
          okr._id === okrId ? { ...okr, status: 'completed' } : okr
        )
      );
    } catch (err) {
      console.error('Error updating OKR status:', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">My OKRs</h2>
      {okrs.length === 0 ? (
        <p className="text-gray-600">No OKRs assigned.</p>
      ) : (
        <div className="space-y-4">
          {okrs.map((okr) => (
            <div key={okr._id} className="bg-white shadow p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-purple-700">{okr.objective}</h3>
                  <p className="text-sm text-gray-600 mt-1">Team: {okr.team?.name || 'N/A'}</p>
                  <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
                    {okr.keyResults.map((kr, i) => (
                      <li key={i}>{kr}</li>
                    ))}
                  </ul>
                  <p className="text-sm mt-2 font-medium text-gray-500">
                    Status: <span className={okr.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}>
                      {okr.status || 'in progress'}
                    </span>
                  </p>
                </div>

                {okr.status !== 'completed' && (
                  <button
                    onClick={() => handleMarkCompleted(okr._id)}
                    className="ml-4 bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployeeOKRs;
