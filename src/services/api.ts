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

// API functions
export const authApi = {
  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { token: 'mock-jwt-token', user: mockCourses[0].teacher };
  },

  register: async (userData: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { token: 'mock-jwt-token', user: userData };
  }
};

export const coursesApi = {
  getAllCourses: async (): Promise<Course[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCourses;
  },

  getCourse: async (id: string): Promise<Course> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const course = mockCourses.find(c => c.id === id);
    if (!course) throw new Error('Course not found');
    return course;
  },

  createCourse: async (courseData: Partial<Course>): Promise<Course> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newCourse: Course = {
      id: Date.now().toString(),
      ...courseData,
      lessons: [],
      enrolledStudents: [],
      createdAt: new Date().toISOString(),
      isActive: true
    } as Course;
    mockCourses.push(newCourse);
    return newCourse;
  },

  enrollInCourse: async (courseId: string, userId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const course = mockCourses.find(c => c.id === courseId);
    if (course && !course.enrolledStudents.includes(userId)) {
      course.enrolledStudents.push(userId);
    }
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