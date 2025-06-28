import express from 'express';
import OKR from '../models/OKR.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all OKRs (admin access)
router.get('/', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const okrs = await OKR.find()
      .populate('team', 'name')
      .populate('assignedUsers', 'name email');
    res.status(200).json(okrs);
  } catch (err) {
    console.error('Error fetching OKRs:', err);
    res.status(500).json({ error: 'Failed to fetch OKRs' });
  }
});

// GET OKRs assigned to a specific user (employee access)
router.get('/assigned/:userId', protect, authorizeRoles('employee'), async (req, res) => {
  try {
    const okrs = await OKR.find({ assignedUsers: req.params.userId })
      .populate('team', 'name');
    res.status(200).json(okrs);
  } catch (err) {
    console.error('Error fetching assigned OKRs:', err);
    res.status(500).json({ error: 'Failed to fetch assigned OKRs' });
  }
});

// PUT update OKR status (employee access)
router.put('/:id/status', protect, authorizeRoles('employee'), async (req, res) => {
  try {
    const { status } = req.body;

    if (!['in progress', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const updated = await OKR.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('team', 'name');

    if (!updated) {
      return res.status(404).json({ error: 'OKR not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating OKR status:', err);
    res.status(500).json({ error: 'Failed to update OKR status' });
  }
});

// POST create a new OKR (admin access)
router.post('/', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { objective, keyResults, team, assignedUsers } = req.body;

    const newOKR = new OKR({ objective, keyResults, team, assignedUsers });

    const savedOKR = await newOKR.save();
    const populatedOKR = await OKR.findById(savedOKR._id)
      .populate('team', 'name')
      .populate('assignedUsers', 'name email');

    res.status(201).json(populatedOKR);
  } catch (err) {
    console.error('Error creating OKR:', err);
    res.status(500).json({ error: 'Failed to create OKR' });
  }
});

// PUT update an existing OKR (admin access)
router.put('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { objective, keyResults, team, assignedUsers } = req.body;

    const updatedOKR = await OKR.findByIdAndUpdate(
      req.params.id,
      { objective, keyResults, team, assignedUsers },
      { new: true }
    )
      .populate('team', 'name')
      .populate('assignedUsers', 'name email');

    if (!updatedOKR) {
      return res.status(404).json({ error: 'OKR not found' });
    }

    res.status(200).json(updatedOKR);
  } catch (err) {
    console.error('Error updating OKR:', err);
    res.status(500).json({ error: 'Failed to update OKR' });
  }
});

// DELETE an OKR (admin access)
router.delete('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const deletedOKR = await OKR.findByIdAndDelete(req.params.id);

    if (!deletedOKR) {
      return res.status(404).json({ error: 'OKR not found' });
    }

    res.status(204).end();
  } catch (err) {
    console.error('Error deleting OKR:', err);
    res.status(500).json({ error: 'Failed to delete OKR' });
  }
});

export default router;
