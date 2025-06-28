import express from 'express';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// GET employee details by ID
router.get('/:id', protect, authorizeRoles('employee'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: 'team',
      populate: { path: 'department' },
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

export default router;
