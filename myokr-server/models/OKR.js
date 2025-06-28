// models/OKR.js
import mongoose from 'mongoose';

const OKRSchema = new mongoose.Schema({
  objective: {
    type: String,
    required: true,
  },
  keyResults: {
    type: [String],
    required: true,
    validate: [arr => arr.length > 0, 'At least one key result is required'],
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  assignedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  status: {
    type: String,
    enum: ['in progress', 'completed'],
    default: 'in progress',
  }
}, { timestamps: true });

const OKR = mongoose.model('OKR', OKRSchema);
export default OKR;
