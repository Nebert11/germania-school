import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import TeacherDashboard from './components/Dashboard/TeacherDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import CourseList from './components/Courses/CourseList';
import VocabularyTrainer from './components/Vocabulary/VocabularyTrainer';
import LiveClassRoom from './components/LiveClass/LiveClassRoom';
import ForumList from './components/Forum/ForumList';
import ProgressTracker from './components/Progress/ProgressTracker';
import QuizComponent from './components/Quiz/QuizComponent';
import UsersPage from './components/Users/UsersPage';
import AnalyticsPage from './components/Analytics/AnalyticsPage';
import SettingsPage from './components/Settings/SettingsPage';
import ProfilePage from './components/Profile/ProfilePage';
import MyCourses from './components/Courses/MyCourses';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentHash, setCurrentHash] = useState(() => window.location.hash.substring(1));
  const [showAuthForm, setShowAuthForm] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const onHashChange = () => {
      setCurrentHash(window.location.hash.substring(1));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {showAuthForm === 'login' ? (
            <LoginForm onToggleForm={() => setShowAuthForm('register')} />
          ) : (
            <RegisterForm onToggleForm={() => setShowAuthForm('login')} />
          )}
        </div>
      </div>
    );
  }

  const renderContent = () => {
    const hash = currentHash;
    
    switch (hash) {
      case 'courses':
        return <CourseList />;
      case 'my-courses':
        return <MyCourses />;
      case 'vocabulary':
        return <VocabularyTrainer />;
      case 'live':
        return <LiveClassRoom classId="1" className="German Conversation Practice" />;
      case 'forum':
        return <ForumList />;
      case 'progress':
        return <ProgressTracker />;
      case 'quiz':
        return (
          <QuizComponent
            title="German Grammar Quiz"
            questions={[
              {
                id: '1',
                question: 'What is the correct article for "Haus" (house)?',
                type: 'multiple-choice',
                options: ['der', 'die', 'das'],
                correctAnswer: 'das',
                explanation: 'House (Haus) is neuter, so it takes "das"'
              },
              {
                id: '2',
                question: 'German has four cases.',
                type: 'true-false',
                correctAnswer: 'True',
                explanation: 'German has four cases: Nominative, Accusative, Dative, and Genitive'
              },
              {
                id: '3',
                question: 'Complete the sentence: "Ich _____ Deutsch" (I learn German)',
                type: 'fill-blank',
                correctAnswer: 'lerne',
                explanation: 'The verb "lernen" (to learn) conjugated for "ich" is "lerne"'
              }
            ]}
            onComplete={(score) => console.log('Quiz completed with score:', score)}
          />
        );
      case 'users':
        return <UsersPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        // Default dashboard based on user role
        switch (user.role) {
          case 'teacher':
            return <TeacherDashboard />;
          case 'admin':
            return <AdminDashboard />;
          default:
            return <StudentDashboard />;
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-white dark:bg-gray-800 dark:text-gray-100 transition-colors">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;