import express, { Request } from 'express';
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

// PUT /api/users/:id/avatar - set user avatar (expects base64/data URL)
router.put('/:id/avatar', async (req: Request, res) => {
  try {
    const { id } = req.params;
    const { avatar } = req.body as { avatar?: string };
    if (!avatar || typeof avatar !== 'string') {
      return res.status(400).json({ message: 'Invalid avatar' });
    }
    const user = await User.findByIdAndUpdate(
      id,
      { avatar },
      { new: true, projection: { password: 0 } }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update avatar', error: (err as Error).message });
  }
});

export default router;


