import express, { Request } from 'express';
import User from '../models/User';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Multer storage for avatar uploads
const avatarsDir = path.join(__dirname, '../../uploads/avatars');
fs.mkdirSync(avatarsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, avatarsDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const ext = path.extname(file.originalname) || '.png';
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
    cb(null, `${req.params.id || 'user'}-${Date.now()}-${base}${ext}`);
  },
});

const upload = multer({ storage });

// GET /api/users - list all users (without passwords)
router.get('/', async (_req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// PUT /api/users/:id/avatar - upload and set user avatar
router.put('/:id/avatar', upload.single('avatar'), async (req: Request, res) => {
  try {
    const { id } = req.params;
    const file = (req as Request & { file?: Express.Multer.File }).file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const relativePath = `/uploads/avatars/${file.filename}`;
    const user = await User.findByIdAndUpdate(
      id,
      { avatar: relativePath },
      { new: true, projection: { password: 0 } }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update avatar', error: (err as Error).message });
  }
});

export default router;


