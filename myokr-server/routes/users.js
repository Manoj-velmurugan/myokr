import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// ✅ GET all users with team details (Admin only)
// routes/users.js
// GET all users
// GET only employees
router.get('/', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.find({ role: 'employee' }).populate('team', 'name');
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});




// ✅ CREATE a new user (Admin only)
router.post('/', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, email, position, team, role, password } = req.body;

    const newUser = new User({ name, email, position, team, role, password });
    const savedUser = await newUser.save();
    const populatedUser = await User.findById(savedUser._id).populate('team', 'name');

    res.status(201).json(populatedUser);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(400).json({ message: 'Failed to create user' });
  }
});

// ✅ UPDATE user by ID (Admin only)
router.put('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { name, email, position, team } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, position, team },
      { new: true }
    ).populate('team', 'name');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// ✅ DELETE user by ID (Admin only)
router.delete('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.sendStatus(204); // No Content
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

export default router;
