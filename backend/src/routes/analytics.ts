import express from 'express';
import Enrollment from '../models/Enrollment';
import Course from '../models/Course';

const router = express.Router();

// GET /api/analytics/completion-rate
router.get('/completion-rate', async (_req, res) => {
  try {
    // Simple placeholder: completed lessons not tracked; approximate as ratio of enrolled to arbitrary scaler
    const totalEnrollments = await Enrollment.countDocuments();
    const totalCourses = await Course.countDocuments();
    const denominator = Math.max(1, totalEnrollments + totalCourses);
    const completionRate = Math.min(100, Math.round((totalEnrollments / denominator) * 100));
    res.json({ completionRate });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;


