import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // Optional but helps when no leader is assigned yet
  },
});

const Team = mongoose.model('Team', teamSchema);
export default Team;
