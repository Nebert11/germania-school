import express from 'express';
import Course from '../models/Course';
import Enrollment from '../models/Enrollment';
import User from '../models/User';

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
    const courses = await Course.find().populate('teacher', 'firstName lastName email role');
    // Attach enrolledStudents as array of user ids for accuracy
    const withEnrollmentUsers = await Promise.all(
      courses.map(async (c) => {
        const enrollments = await Enrollment.find({ course: c._id }).select('user');
        const enrolledStudents = enrollments.map((e) => String(e.user));
        return { ...c.toObject(), enrolledStudents };
      })
    );
    res.json(withEnrollmentUsers);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// Get a course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('teacher', 'firstName lastName email role');
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

// Assign a teacher to a course
router.put('/:id/assign-teacher', async (req, res) => {
  try {
    const { teacher } = req.body;
    const teacherUser = await User.findById(teacher);
    if (!teacherUser || teacherUser.role !== 'teacher') {
      return res.status(400).json({ error: 'Invalid teacher id' });
    }
    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      { teacher },
      { new: true }
    ).populate('teacher', 'firstName lastName email role');
    if (!updated) return res.status(404).json({ error: 'Course not found' });
    res.json(updated);
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