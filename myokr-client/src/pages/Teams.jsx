import { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance'; // ✅ token-enabled instance
import { motion, AnimatePresence } from 'framer-motion';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);

  const [teamName, setTeamName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLeader, setSelectedLeader] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editTeamId, setEditTeamId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamRes, depRes, userRes] = await Promise.all([
        axios.get('/teams'),
        axios.get('/departments'),
        axios.get('/users'),
      ]);
      setTeams(teamRes.data);
      setDepartments(depRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      alert('Error loading team data');
    }
  };

  const resetForm = () => {
    setTeamName('');
    setSelectedDepartment('');
    setSelectedLeader('');
    setIsEditing(false);
    setEditTeamId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: teamName,
      department: selectedDepartment,
      leader: selectedLeader || null,
    };

    try {
      if (isEditing) {
        await axios.put(`/teams/${editTeamId}`, payload);
      } else {
        await axios.post('/teams', payload);
      }
      fetchData();
      resetForm();
      setShowModal(false);
    } catch (err) {
      console.error('Failed to save team:', err);
      alert('Failed to save team');
    }
  };

  const handleEdit = (team) => {
    setTeamName(team.name);
    setSelectedDepartment(team.department?._id || '');
    setSelectedLeader(team.leader?._id || '');
    setEditTeamId(team._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    try {
      await axios.delete(`/teams/${id}`);
      fetchData();
    } catch (err) {
      console.error('Failed to delete team:', err);
      alert('Failed to delete');
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Teams</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Create Team
          </button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">
                {isEditing ? 'Edit Team' : 'Create Team'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Team Name"
                  required
                  className="w-full px-4 py-2 border rounded"
                />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedLeader}
                  onChange={(e) => setSelectedLeader(e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                >
                  <option value="">Select Leader (optional)</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setShowModal(false);
                    }}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    {isEditing ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Team Cards */}
      <div className="max-h-[75vh] overflow-y-auto pr-1 custom-scrollbar pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team._id} className="bg-white shadow-md rounded-xl p-4 relative">
            <h3 className="text-lg font-semibold text-gray-800">{team.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              Department: {team.department?.name || 'N/A'}
            </p>
            <p className="text-sm text-gray-500">
              Leader: {team.leader?.name || 'Unassigned'}
            </p>
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => handleEdit(team)}
                className="text-blue-600 text-sm hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(team._id)}
                className="text-red-600 text-sm hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

export default Teams;
