import { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance'

function Teams() {
  const [teams, setTeams] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLeader, setSelectedLeader] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTeamId, setEditTeamId] = useState(null);

  useEffect(() => {
    fetchTeams();
    axios.get('http://localhost:5000/api/departments').then(res => setDepartments(res.data));
    axios.get('http://localhost:5000/api/users').then(res => setUsers(res.data));
  }, []);

  const fetchTeams = () => {
    axios.get('http://localhost:5000/api/teams').then(res => setTeams(res.data));
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
    const teamData = {
      name: teamName,
      department: selectedDepartment,
      leader: selectedLeader || null,
    };

    try {
      if (isEditing && editTeamId) {
        await axios.put(`http://localhost:5000/api/teams/${editTeamId}`, teamData);
      } else {
        await axios.post('http://localhost:5000/api/teams', teamData);
      }
      fetchTeams();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error('Error saving team:', err);
      alert('Failed to save team');
    }
  };

  const handleEdit = (team) => {
    setIsEditing(true);
    setEditTeamId(team._id);
    setTeamName(team.name);
    setSelectedDepartment(team.department?._id || '');
    setSelectedLeader(team.leader?._id || '');
    setShowModal(true);
    setDeleteMode(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/teams/${id}`);
      fetchTeams();
    } catch (err) {
      console.error('Error deleting team:', err);
      alert('Delete failed');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Teams</h2>
        <div className="space-x-2">
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
              setDeleteMode(false);
            }}
            className="bg-white shadow-lg rounded px-4 py-2 hover:bg-purple-700 hover:text-white"
          >
            + Add Team
          </button>
          <button
            onClick={() => {
              setDeleteMode(!deleteMode);
              resetForm();
              setShowModal(false);
            }}
            className={`${
              deleteMode ? 'bg-red-600' : 'bg-red-500'
            } text-white px-4 py-2 rounded hover:bg-red-700`}
          >
            {deleteMode ? 'Cancel Delete' : 'Delete Team'}
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              {isEditing ? 'Edit Team' : 'Add Team'}
            </h3>
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Team Name"
                className="w-full px-4 py-2 border rounded"
                required
              />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                required
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedLeader}
                onChange={(e) => setSelectedLeader(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="">Select Team Leader (Optional)</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
              >
                {isEditing ? 'Update Team' : 'Save Team'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team._id} className="bg-white shadow-md rounded-lg p-4 relative">
            <h3 className="text-lg font-bold text-gray-800">{team.name}</h3>
            <p className="text-sm text-gray-600 mt-1">
              Department: {team.department?.name || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">
              Leader: {team.leader?.name || 'No Leader Assigned'}
            </p>

            <div className="absolute top-2 right-2 space-x-2">
              {!deleteMode && (
                <button
                  onClick={() => handleEdit(team)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Edit
                </button>
              )}
              {deleteMode && (
                <button
                  onClick={() => handleDelete(team._id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Teams;
