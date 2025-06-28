// routes/auth.js
import express from 'express';
import User from '../models/User.js';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getCurrentUser);

// ⚠️ Dev-only route to delete all users
router.delete('/delete-all', async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ message: 'Not allowed in production' });
  }

  try {
    await User.deleteMany({});
    res.send({ message: 'All users deleted' });
  } catch (err) {
    res.status(500).send({ message: 'Error deleting users' });
  }
});

export default router;
