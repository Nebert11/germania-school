import express from 'express';
import Enrollment from '../models/Enrollment';
import Course from '../models/Course';
import User from '../models/User';

const router = express.Router();

// Enroll a user in a course
router.post('/', async (req, res) => {
  try {
    const { user, course } = req.body;
    const enrollment = new Enrollment({ user, course });
    await enrollment.save();
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Unenroll a user from a course
router.delete('/', async (req, res) => {
  try {
    const { user, course } = req.body;
    const result = await Enrollment.findOneAndDelete({ user, course });
    if (!result) return res.status(404).json({ error: 'Enrollment not found' });
    res.json({ message: 'Unenrolled successfully' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// List all courses a user is enrolled in
router.get('/user/:userId', async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.params.userId })
      .populate('course');
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// List all users enrolled in a course
router.get('/course/:courseId', async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ course: req.params.courseId })
      .populate('user', 'name email');
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router; 