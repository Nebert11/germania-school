import express from 'express';
import User from '../models/User';

const router = express.Router();

// GET /api/users - list all users (without passwords)
router.get('/', async (_req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;


