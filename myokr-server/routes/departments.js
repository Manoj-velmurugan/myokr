import express from 'express';
import Department from '../models/Department.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ GET all departments — protected for logged-in users
router.get('/', protect, async (req, res) => {
  try {
    console.log('📥 GET /departments triggered by:', req.user?.email || req.user?.id);
    const departments = await Department.find().sort({ name: 1 });
    res.json(departments);
  } catch (err) {
    console.error('❌ Failed to fetch departments:', err);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

// ✅ CREATE department — only admin allowed
router.post('/', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    console.log('📥 POST /departments by admin:', req.user?.email);
    const newDepartment = new Department({ name: req.body.name });
    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (err) {
    console.error('❌ Failed to create department:', err);
    res.status(500).json({ error: 'Failed to create department' });
  }
});

// ✅ UPDATE department — only admin allowed
router.put('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    console.log('📥 PUT /departments/:id by admin:', req.user?.email);
    const updated = await Department.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('❌ Failed to update department:', err);
    res.status(500).json({ error: 'Failed to update department' });
  }
});

// ✅ DELETE department — only admin allowed
router.delete('/:id', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    console.log('📥 DELETE /departments/:id by admin:', req.user?.email);
    await Department.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error('❌ Failed to delete department:', err);
    res.status(500).json({ error: 'Failed to delete department' });
  }
});

export default router;
