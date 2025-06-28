import { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';

function OKRs() {
  const [okrs, setOkrs] = useState([]);
  const [filteredOkrs, setFilteredOkrs] = useState([]);
  const [objective, setObjective] = useState('');
  const [keyResults, setKeyResults] = useState(['']);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editObjective, setEditObjective] = useState('');
  const [editKeyResults, setEditKeyResults] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [teamUsers, setTeamUsers] = useState([]);

  const [filterTeam, setFilterTeam] = useState('');
  const [searchObjective, setSearchObjective] = useState('');

  useEffect(() => {
    axios.get('/okrs')
      .then(res => {
        setOkrs(res.data);
        setFilteredOkrs(res.data);
      })
      .catch(err => console.error('Error fetching OKRs:', err));

    axios.get('/teams')
      .then(res => setTeams(res.data))
      .catch(err => console.error('Error fetching teams:', err));

    axios.get('/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      const filtered = users.filter(user => {
        const teamId = typeof user.team === 'object' ? user.team._id : user.team;
        return teamId === selectedTeam;
      });
      setTeamUsers(filtered);
    } else {
      setTeamUsers([]);
    }
  }, [selectedTeam, users]);

  useEffect(() => {
    let filtered = [...okrs];
    if (filterTeam) {
      filtered = filtered.filter(okr => okr.team?._id === filterTeam);
    }
    if (searchObjective.trim() !== '') {
      const keyword = searchObjective.trim().toLowerCase();
      filtered = filtered.filter(okr =>
        okr.objective.toLowerCase().includes(keyword)
      );
    }
    setFilteredOkrs(filtered);
  }, [filterTeam, searchObjective, okrs]);

  const toggleUserSelection = (id) => {
    setAssignedUsers(prev =>
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    );
  };

  const handleAddOKR = async (e) => {
    e.preventDefault();
    const newOKR = {
      objective,
      keyResults: keyResults.filter(kr => kr.trim() !== ''),
      team: selectedTeam,
      assignedUsers,
    };

    try {
      const res = await axios.post('/okrs', newOKR);
      setOkrs([...okrs, res.data]);
      resetForm();
    } catch (err) {
      console.error('Error adding OKR:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/okrs/${id}`);
      setOkrs(okrs.filter(okr => okr._id !== id));
    } catch (err) {
      console.error('Error deleting OKR:', err);
    }
  };

  const handleEditClick = (okr) => {
    setEditingId(okr._id);
    setEditObjective(okr.objective);
    setEditKeyResults([...okr.keyResults]);
    setSelectedTeam(okr.team?._id || '');
    setAssignedUsers(okr.assignedUsers?.map(u => u._id) || []);
    setShowForm(true);
  };

  const handleEditKRChange = (index, value) => {
    const updated = [...editKeyResults];
    updated[index] = value;
    setEditKeyResults(updated);
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await axios.put(`/okrs/${id}`, {
        objective: editObjective,
        keyResults: editKeyResults.filter(kr => kr.trim() !== ''),
        team: selectedTeam,
        assignedUsers,
      });
      setOkrs(okrs.map(okr => (okr._id === id ? res.data : okr)));
      resetForm();
    } catch (err) {
      console.error('Error updating OKR:', err);
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setObjective('');
    setKeyResults(['']);
    setEditObjective('');
    setEditKeyResults([]);
    setAssignedUsers([]);
    setSelectedTeam('');
    setTeamUsers([]);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Team OKRs</h2>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          onClick={() => setShowForm(true)}
        >
          + Add OKR
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Team</label>
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Teams</option>
            {teams.map(team => (
              <option key={team._id} value={team._id}>{team.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search Objective</label>
          <input
            type="text"
            value={searchObjective}
            onChange={(e) => setSearchObjective(e.target.value)}
            placeholder="Search by objective text..."
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Modal for Create/Edit */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
              <form
                onSubmit={editingId
                  ? (e) => {
                      e.preventDefault();
                      handleSaveEdit(editingId);
                    }
                  : handleAddOKR}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold">
                  {editingId ? 'Edit OKR' : 'Create OKR'}
                </h3>

                {/* Objective */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Objective</label>
                  <textarea
                    value={editingId ? editObjective : objective}
                    onChange={(e) =>
                      editingId ? setEditObjective(e.target.value) : setObjective(e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    required
                    placeholder="Enter the objective here..."
                  />
                </div>

                {/* Key Results */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Key Results</label>
                  {(editingId ? editKeyResults : keyResults).map((kr, i) => (
                    <textarea
                      key={i}
                      value={kr}
                      onChange={(e) =>
                        editingId
                          ? handleEditKRChange(i, e.target.value)
                          : setKeyResults((prev) => {
                              const updated = [...prev];
                              updated[i] = e.target.value;
                              return updated;
                            })
                      }
                      className="mt-1 block w-full mb-2 border border-gray-300 rounded-md shadow-sm p-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={2}
                      placeholder={`Key Result ${i + 1}`}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      editingId
                        ? setEditKeyResults([...editKeyResults, ''])
                        : setKeyResults([...keyResults, ''])
                    }
                    className="text-sm text-purple-600 hover:underline mt-2"
                  >
                    + Add another Key Result
                  </button>
                </div>

                {/* Team Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Team</label>
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Team</option>
                    {teams.map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assigned Users */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assign to Users</label>
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-200">
                    {teamUsers.length > 0 ? (
                      teamUsers.map((user) => (
                        <label key={user._id} className="flex items-center text-sm gap-2">
                          <input
                            type="checkbox"
                            value={user._id}
                            checked={assignedUsers.includes(user._id)}
                            onChange={() => toggleUserSelection(user._id)}
                          />
                          {user.name}
                        </label>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No employees in this team.</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    {editingId ? 'Update OKR' : 'Save OKR'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OKR Cards */}
      <div className="max-h-[70vh] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-200">
        {filteredOkrs.length > 0 ? (
          filteredOkrs.map((okr) => (
            <div key={okr._id} className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold text-gray-700">{okr.objective}</h3>
              <p className="text-sm text-gray-500">Team: {okr.team?.name || 'N/A'}</p>
              <ul className="list-disc list-inside text-gray-600 mt-2">
                {okr.keyResults.map((kr, i) => (
                  <li key={i}>{kr}</li>
                ))}
              </ul>
              <div className="text-sm text-gray-500 mt-2">
                Assigned Users: {okr.assignedUsers?.map((u) => u.name).join(', ') || 'None'}
              </div>
              <div className="mt-2">
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    okr.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {okr.status === 'completed' ? 'Completed' : 'In Progress'}
                </span>
              </div>
              <div className="mt-2 flex gap-3">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => handleEditClick(okr)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => handleDelete(okr._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-10">No OKRs found.</p>
        )}
      </div>
    </div>
  );
}

export default OKRs;
