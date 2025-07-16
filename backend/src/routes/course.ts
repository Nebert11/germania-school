import express from 'express';
import Course from '../models/Course';

const router = express.Router();

// Create a new course
router.post('/', async (req, res) => {
  try {
    const { title, description, teacher } = req.body;
    const course = new Course({ title, description, teacher });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Get all courses
router.get('/', async (_req, res) => {
  try {
    const courses = await Course.find().populate('teacher', 'name email');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Get a course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('teacher', 'name email');
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Update a course
router.put('/:id', async (req, res) => {
  try {
    const { title, description, teacher } = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, teacher },
      { new: true }
    );
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Delete a course
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router; 