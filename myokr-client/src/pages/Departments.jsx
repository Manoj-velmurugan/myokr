import { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [showDeleteMode, setShowDeleteMode] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const depRes = await axios.get('/departments');
      const teamRes = await axios.get('/teams');
      setDepartments(depRes.data);
      setTeams(teamRes.data);
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Failed to fetch data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`/departments/${editId}`, { name });
      } else {
        await axios.post('/departments', { name });
      }
      setShowForm(false);
      setName('');
      setIsEdit(false);
      setEditId(null);
      fetchData();
    } catch (err) {
      console.error('Failed to save department', err);
      alert('Failed to save department');
    }
  };

  const handleEdit = (dept) => {
    setName(dept.name);
    setIsEdit(true);
    setEditId(dept._id);
    setShowForm(true);
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm('Delete selected departments?')) return;
    try {
      await Promise.all(
        selectedDepartments.map((id) =>
          axios.delete(`/departments/${id}`)
        )
      );
      setSelectedDepartments([]);
      setShowDeleteMode(false);
      fetchData();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Delete failed');
    }
  };

  const toggleSelect = (id) => {
    setSelectedDepartments((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Departments</h2>
        <div className="flex gap-4">
          {showDeleteMode && selectedDepartments.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete Selected
            </button>
          )}
          <button
            onClick={() => setShowDeleteMode(!showDeleteMode)}
            className={`px-4 py-2 rounded text-white ${
              showDeleteMode
                ? 'bg-yellow-600 hover:bg-yellow-700'
                : 'bg-yellow-500 hover:bg-yellow-600'
            }`}
          >
            {showDeleteMode ? 'Cancel Delete' : 'Delete Departments'}
          </button>
          <button
            onClick={() => {
              setShowForm(true);
              setIsEdit(false);
              setName('');
              setEditId(null);
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            + Create Department
          </button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">
                {isEdit ? 'Edit Department' : 'Create Department'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Department Name"
                  className="px-4 py-2 border rounded w-full"
                  required
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setName('');
                      setIsEdit(false);
                      setEditId(null);
                    }}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    {isEdit ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Department Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept._id} className="bg-white shadow-md rounded-xl p-4 relative">
            {showDeleteMode && (
              <input
                type="checkbox"
                checked={selectedDepartments.includes(dept._id)}
                onChange={() => toggleSelect(dept._id)}
                className="absolute top-2 left-2"
              />
            )}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">{dept.name}</h3>
            </div>
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => handleEdit(dept)}
                className="text-blue-600 text-sm hover:underline"
              >
                Edit
              </button>
            </div>
            <AnimatePresence>
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 space-y-2 overflow-hidden"
              >
                {teams
                  .filter((team) => team.department?._id === dept._id)
                  .map((team) => (
                    <div
                      key={team._id}
                      className="bg-gray-100 p-2 rounded text-sm text-gray-700"
                    >
                      {team.name}{' '}
                      {team.leader ? `(Lead: ${team.leader.name})` : ''}
                    </div>
                  ))}
              </motion.div>
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Departments;
