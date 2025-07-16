import { Course, Lesson, User, LiveClass, ForumPost, VocabularyWord, Message, Progress } from '../types';

// Mock data
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'German for Beginners',
    description: 'Learn the basics of German language with interactive lessons and practical exercises.',
    thumbnail: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
    teacherId: '2',
    teacher: {
      id: '2',
      email: 'teacher@germania.com',
      firstName: 'Maria',
      lastName: 'Schmidt',
      role: 'teacher',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      createdAt: '2024-01-15T10:00:00Z',
      isActive: true
    },
    level: 'beginner',
    type: 'hybrid',
    price: 199,
    duration: '8 weeks',
    lessons: [],
    enrolledStudents: ['1'],
    createdAt: '2024-01-15T10:00:00Z',
    isActive: true
  },
  {
    id: '2',
    title: 'Advanced German Conversation',
    description: 'Master German conversation skills with native speakers and advanced grammar.',
    thumbnail: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1',
    teacherId: '3',
    teacher: {
      id: '3',
      email: 'teacher2@germania.com',
      firstName: 'Hans',
      lastName: 'Mueller',
      role: 'teacher',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      createdAt: '2024-01-10T10:00:00Z',
      isActive: true
    },
    level: 'advanced',
    type: 'live',
    price: 299,
    duration: '12 weeks',
    lessons: [],
    enrolledStudents: ['1'],
    createdAt: '2024-01-10T10:00:00Z',
    isActive: true
  }
];

const mockLessons: Lesson[] = [
  {
    id: '1',
    courseId: '1',
    title: 'Basic Greetings',
    description: 'Learn how to greet people in German',
    content: [
      {
        id: '1',
        type: 'text',
        title: 'Introduction to German Greetings',
        content: 'German greetings are an essential part of daily communication...',
        order: 1
      },
      {
        id: '2',
        type: 'video',
        title: 'Pronunciation Guide',
        content: { url: 'https://example.com/video1' },
        order: 2
      }
    ],
    order: 1,
    duration: 30,
    isCompleted: false,
    createdAt: '2024-01-15T10:00:00Z'
  }
];

const mockVocabulary: VocabularyWord[] = [
  {
    id: '1',
    word: 'Hallo',
    translation: 'Hello',
    pronunciation: 'HAH-loh',
    example: 'Hallo, wie geht es dir?',
    level: 'beginner',
    category: 'greetings',
    userId: '1',
    masteryLevel: 3,
    lastReviewed: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    word: 'Danke',
    translation: 'Thank you',
    pronunciation: 'DAHN-keh',
    example: 'Danke für deine Hilfe.',
    level: 'beginner',
    category: 'politeness',
    userId: '1',
    masteryLevel: 5,
    lastReviewed: '2024-01-14T10:00:00Z'
  }
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error('Login failed');
    return await res.json();
  },

  register: async (userData: any) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!res.ok) throw new Error('Registration failed');
    return await res.json();
  }
};

export const coursesApi = {
  getAllCourses: async () => {
    const res = await fetch(`${API_BASE_URL}/api/courses`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    return await res.json();
  },

  getCourse: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/api/courses/${id}`);
    if (!res.ok) throw new Error('Course not found');
    return await res.json();
  },

  createCourse: async (courseData: any, token?: string) => {
    const res = await fetch(`${API_BASE_URL}/api/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(courseData)
    });
    if (!res.ok) throw new Error('Failed to create course');
    return await res.json();
  },

  enrollInCourse: async (courseId: string, userId: string, token?: string) => {
    const res = await fetch(`${API_BASE_URL}/api/enrollments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ course: courseId, user: userId })
    });
    if (!res.ok) throw new Error('Failed to enroll in course');
    return await res.json();
  }
};

export const lessonsApi = {
  getLessons: async (courseId: string): Promise<Lesson[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockLessons.filter(l => l.courseId === courseId);
  },

  getLesson: async (id: string): Promise<Lesson> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const lesson = mockLessons.find(l => l.id === id);
    if (!lesson) throw new Error('Lesson not found');
    return lesson;
  },

  createLesson: async (lessonData: Partial<Lesson>): Promise<Lesson> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newLesson: Lesson = {
      id: Date.now().toString(),
      ...lessonData,
      createdAt: new Date().toISOString()
    } as Lesson;
    mockLessons.push(newLesson);
    return newLesson;
  }
};

export const vocabularyApi = {
  getVocabulary: async (userId: string): Promise<VocabularyWord[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockVocabulary.filter(v => v.userId === userId);
  },

  addWord: async (wordData: Partial<VocabularyWord>): Promise<VocabularyWord> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newWord: VocabularyWord = {
      id: Date.now().toString(),
      ...wordData,
      masteryLevel: 1,
      lastReviewed: new Date().toISOString()
    } as VocabularyWord;
    mockVocabulary.push(newWord);
    return newWord;
  },

  updateMastery: async (wordId: string, masteryLevel: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const word = mockVocabulary.find(w => w.id === wordId);
    if (word) {
      word.masteryLevel = masteryLevel;
      word.lastReviewed = new Date().toISOString();
    }
  }
};

export const progressApi = {
  getProgress: async (userId: string): Promise<Progress[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [];
  },

  updateProgress: async (progressData: Partial<Progress>): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Mock implementation
  }
};

export const enrollmentsApi = {
  getUserEnrollments: async (userId: string, token?: string) => {
    const res = await fetch(`${API_BASE_URL}/api/enrollments/user/${userId}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    if (!res.ok) throw new Error('Failed to fetch enrollments');
    return await res.json();
  }
};