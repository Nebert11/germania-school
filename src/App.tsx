import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
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

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [showAuthForm, setShowAuthForm] = useState<'login' | 'register'>('login');

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
    // Parse hash navigation
    const hash = window.location.hash.substring(1);
    
    switch (hash) {
      case 'courses':
        return <CourseList />;
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
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;