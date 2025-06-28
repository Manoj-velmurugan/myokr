import { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import userIcon from '../assets/user-icon.svg'; 

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDeleteMode, setShowDeleteMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Error fetching users:', err));

    axios.get('/teams')
      .then(res => setTeams(res.data))
      .catch(err => console.error('Error fetching teams:', err));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const userData = { name, email, position, team: selectedTeam };

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        }
      };

      if (isEditMode) {
        const res = await axios.put(`/users/${editUserId}`, userData, config);
        setUsers(users.map(u => u._id === editUserId ? res.data : u));
      } else {
        const res = await axios.post('/users', userData, config);
        setUsers([...users, res.data]);
      }

      resetForm();
    } catch (err) {
      console.error('Error saving user:', err);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPosition('');
    setSelectedTeam('');
    setEditUserId(null);
    setIsEditMode(false);
    setShowForm(false);
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm("Are you sure you want to delete selected users?")) return;
    try {
      await Promise.all(selectedUsers.map(userId =>
        axios.delete(`/users/${userId}`)
      ));
      setUsers(users.filter(user => !selectedUsers.includes(user._id)));
      setSelectedUsers([]);
      setShowDeleteMode(false);
    } catch (err) {
      console.error('Error deleting users:', err);
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const startEditUser = (user) => {
    setName(user.name);
    setEmail(user.email);
    setPosition(user.position);
    setSelectedTeam(user.team?._id || '');
    setEditUserId(user._id);
    setIsEditMode(true);
    setShowForm(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesTeam = filterTeam ? user.team?._id === filterTeam : true;
    const matchesPosition = filterPosition
      ? user.position?.toLowerCase().includes(filterPosition.toLowerCase())
      : true;
    return matchesTeam && matchesPosition;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Users</h2>
        <div className="flex gap-4">
          {showDeleteMode && selectedUsers.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete Selected
            </button>
          )}
          <button
            onClick={() => setShowDeleteMode(!showDeleteMode)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            {showDeleteMode ? 'Cancel Delete' : 'Delete Users'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleAddUser} className="mb-6 space-y-3 bg-white p-4 rounded shadow-md">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="px-4 py-2 border rounded w-full"
            required
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="px-4 py-2 border rounded w-full"
            required
          />
          <input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Position"
            className="px-4 py-2 border rounded w-full"
          />
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="px-4 py-2 border rounded w-full"
          >
            <option value="">Select Team</option>
            {teams.map(team => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full"
          >
            {isEditMode ? 'Update User' : 'Save User'}
          </button>
        </form>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={filterTeam}
          onChange={(e) => setFilterTeam(e.target.value)}
          className="px-4 py-2 border rounded w-full sm:w-1/2"
        >
          <option value="">Filter by Team</option>
          {teams.map(team => (
            <option key={team._id} value={team._id}>
              {team.name}
            </option>
          ))}
        </select>
        <input
          value={filterPosition}
          onChange={(e) => setFilterPosition(e.target.value)}
          placeholder="Filter by Position"
          className="px-4 py-2 border rounded w-full sm:w-1/2"
        />
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(user => (
          <div
            key={user._id}
            className={`bg-white shadow-lg rounded-xl p-4 flex items-start gap-4 relative ${showDeleteMode ? 'pr-10' : ''}`}
          >
            {showDeleteMode && (
              <input
                type="checkbox"
                checked={selectedUsers.includes(user._id)}
                onChange={() => toggleUserSelection(user._id)}
                className="mt-2"
              />
            )}
            <img
              src={userIcon}
              alt="User Icon"
              className="w-15 h-14 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-600 mt-1">{user.position || 'No position'}</p>
              <p className="text-sm text-gray-500">
                {user.team?.name ? `Team: ${user.team.name}` : 'No team'}
              </p>
            </div>
            {!showDeleteMode && (
              <button
                className="absolute top-2 right-2 text-sm text-blue-600 hover:underline"
                onClick={() => startEditUser(user)}
              >
                Edit
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Users;
