import express from 'express';
import Department from '../models/Department.js';

const router = express.Router();

// GET all departments
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

// CREATE department
router.post('/', async (req, res) => {
  try {
    const newDepartment = new Department({
      name: req.body.name,
    });
    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create department' });
  }
});

// UPDATE department
router.put('/:id', async (req, res) => {
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

// DELETE department
router.delete('/:id', async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete department' });
  }
});

export default router;
