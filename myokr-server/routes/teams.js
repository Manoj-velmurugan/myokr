import express from 'express';
import mongoose from 'mongoose';    // <-- Add this import
import Team from '../models/Team.js';
import User from '../models/User.js';

const router = express.Router();

// GET all teams with department & leader populated
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('department', 'name')
      .populate('leader', 'name email');
    res.status(200).json(teams);
  } catch (err) {
    console.error('Error fetching teams:', err);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// CREATE a new team
router.post('/', async (req, res) => {
  try {
    const { name, department, leader } = req.body;

    const newTeam = new Team({ name, department, leader });

    const savedTeam = await newTeam.save();

    // Update user's team reference if leader is assigned
    if (leader) {
      await User.findByIdAndUpdate(leader, { team: savedTeam._id });
    }

    const populatedTeam = await Team.findById(savedTeam._id)
      .populate('department', 'name')
      .populate('leader', 'name email');

    res.status(201).json(populatedTeam);
  } catch (err) {
    console.error('Error creating team:', err);
    res.status(500).json({ message: 'Failed to create team' });
  }
});

// UPDATE a team
router.put('/:id', async (req, res) => {
  try {
    const { name, department, leader } = req.body;

    if (department && !mongoose.Types.ObjectId.isValid(department)) {
      return res.status(400).json({ message: 'Invalid department ID' });
    }
    if (leader && !mongoose.Types.ObjectId.isValid(leader)) {
      return res.status(400).json({ message: 'Invalid leader ID' });
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      {
        name,
        department,
        leader: leader || null,
      },
      { new: true, runValidators: true }
    );

    if (!updatedTeam) {
      return res.status(404).json({ error: 'Team not found' });
    }

    if (leader) {
      const updatedUser = await User.findByIdAndUpdate(leader, { team: req.params.id });
      if (!updatedUser) {
        console.warn('Leader user not found for update:', leader);
      }
    }

    // Re-query to get populated document
    const populatedTeam = await Team.findById(updatedTeam._id)
      .populate('department', 'name')
      .populate('leader', 'name email');

    res.status(200).json(populatedTeam);
  } catch (err) {
    console.error('Error updating team:', err);
    res.status(500).json({ message: 'Failed to update team', error: err.message });
  }
});


// DELETE a team
router.delete('/:id', async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error('Error deleting team:', err);
    res.status(500).json({ message: 'Failed to delete team' });
  }
});

export default router;
