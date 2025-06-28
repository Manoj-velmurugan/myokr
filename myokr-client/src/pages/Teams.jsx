import { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance'; // ✅ token-enabled instance

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
    axios.get('/departments').then(res => setDepartments(res.data));
    axios.get('/users').then(res => setUsers(res.data));
  }, []);

  const fetchTeams = () => {
    axios.get('/teams').then(res => setTeams(res.data));
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
        await axios.put(`/teams/${editTeamId}`, teamData);
      } else {
        await axios.post('/teams', teamData);
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
      await axios.delete(`/teams/${id}`);
      fetchTeams();
    } catch (err) {
      console.error('Error deleting team:', err);
      alert('Delete failed');
    }
  };

  return (
    <div>
      {/* ... same JSX UI code ... */}
      {/* Unchanged UI, logic was the main fix */}
    </div>
  );
}

export default Teams;
