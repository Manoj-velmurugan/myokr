import express from 'express';
import Department from '../models/Department.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ GET all departments — protected for logged-in users
router.get('/', protect, async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

// ✅ CREATE department — only admin allowed
router.post('/', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const newDepartment = new Department({ name: req.body.name });
    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create department' });
  }
});

// ✅ UPDATE department — only admin allowed
router.put('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const updated = await Department.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update department' });
  }
});

// ✅ DELETE department — only admin allowed
router.delete('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete department' });
  }
});

export default router;
