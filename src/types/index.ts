export interface User {
  id: string;
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  createdAt: string;
  isActive: boolean;
}

export interface Course {
  id: string;
  _id?: string;
  title: string;
  description: string;
  thumbnail: string;
  teacherId: string;
  teacher: User;
  level: 'beginner' | 'intermediate' | 'advanced';
  type: 'live' | 'recorded' | 'hybrid';
  price: number;
  duration: string;
  lessons: Lesson[];
  enrolledStudents: string[];
  createdAt: string;
  isActive: boolean;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: LessonContent[];
  order: number;
  duration: number;
  isCompleted?: boolean;
  createdAt: string;
}

export interface LessonContent {
  id: string;
  type: 'text' | 'video' | 'quiz' | 'vocabulary';
  title: string;
  content: any;
  order: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  passingScore: number;
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export interface Progress {
  userId: string;
  courseId: string;
  lessonId: string;
  completedAt: string;
  score?: number;
}

export interface LiveClass {
  id: string;
  courseId: string;
  title: string;
  description: string;
  scheduledAt: string;
  duration: number;
  meetingUrl: string;
  teacherId: string;
  maxStudents: number;
  enrolledStudents: string[];
}

export interface ForumPost {
  id: string;
  courseId: string;
  authorId: string;
  author: User;
  title: string;
  content: string;
  replies: ForumReply[];
  createdAt: string;
}

export interface ForumReply {
  id: string;
  postId: string;
  authorId: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  example: string;
  level: string;
  category: string;
  userId: string;
  masteryLevel: number;
  lastReviewed: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  sentAt: string;
}