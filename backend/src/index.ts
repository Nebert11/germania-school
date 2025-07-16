import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import courseRoutes from './routes/course';
import enrollmentRoutes from './routes/enrollment';
import Course from './models/Course';
import User from './models/User';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/germania-school';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    // Insert sample courses if none exist
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      let teacher = await User.findOne({ role: 'teacher' });
      if (!teacher) {
        teacher = await User.create({
          firstName: 'Maria',
          lastName: 'Schmidt',
          email: 'teacher@germania.com',
          password: 'password', // Should be hashed in real use
          role: 'teacher',
          isActive: true,
          createdAt: new Date(),
        });
      }
      await Course.insertMany([
        {
          title: 'German for Beginners',
          description: 'Learn the basics of German language with interactive lessons and practical exercises.',
          teacher: teacher._id,
        },
        {
          title: 'Advanced German Conversation',
          description: 'Master German conversation skills with native speakers and advanced grammar.',
          teacher: teacher._id,
        },
        {
          title: 'Business German',
          description: 'German language skills for the workplace and business communication.',
          teacher: teacher._id,
        },
      ]);
      console.log('Sample courses inserted');
    }
  })
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Germania School API is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 