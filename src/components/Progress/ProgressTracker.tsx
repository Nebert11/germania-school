import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { progressApi, coursesApi } from '../../services/api';
import { Course, Progress } from '../../types';
import { TrendingUp, BookOpen, Clock, Trophy, Calendar, BarChart3 } from 'lucide-react';

const ProgressTracker: React.FC = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressData, coursesData] = await Promise.all([
          progressApi.getProgress(user?.id || ''),
          coursesApi.getAllCourses()
        ]);
        
        setProgress(progressData);
        const enrolledCourses = coursesData.filter(course => 
          course.enrolledStudents.includes(user?.id || '')
        );
        setCourses(enrolledCourses);
      } catch (error) {
        console.error('Error fetching progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const mockStats = {
    totalStudyTime: 42,
    completedLessons: 28,
    averageScore: 87,
    streak: 7,
    weeklyGoal: 10,
    weeklyProgress: 7
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-900 dark:text-gray-100 rounded shadow border border-gray-200 dark:border-gray-700 transition-colors">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Progress Tracker</h2>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Progress Tracker</h1>
        <div className="flex space-x-2">
          {['week', 'month', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period as 'week' | 'month' | 'year')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Study Time</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.totalStudyTime}h</p>
              <p className="text-sm text-green-600 mt-1">+5h this week</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Lessons</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.completedLessons}</p>
              <p className="text-sm text-blue-600 mt-1">3 this week</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center">
            <Trophy className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.averageScore}%</p>
              <p className="text-sm text-green-600 mt-1">+2% from last week</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Study Streak</p>
              <p className="text-2xl font-bold text-gray-900">{mockStats.streak} days</p>
              <p className="text-sm text-orange-600 mt-1">Keep it up!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Goal */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Weekly Goal</h2>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Study Hours</span>
          <span className="text-sm font-medium text-gray-900">
            {mockStats.weeklyProgress}/{mockStats.weeklyGoal} hours
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(mockStats.weeklyProgress / mockStats.weeklyGoal) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {mockStats.weeklyGoal - mockStats.weeklyProgress} hours remaining to reach your goal
        </p>
      </div>

      {/* Course Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Course Progress</h2>
          <div className="space-y-4">
            {courses.map((course) => {
              const progress = Math.floor(Math.random() * 100); // Mock progress
              return (
                <div key={course.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{course.level} • {course.duration}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{progress}%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-1" />
                    <span className="text-sm text-gray-600">On track</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Study Calendar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Study Calendar</h2>
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const hasActivity = Math.random() > 0.7;
              const isToday = i === 15;
              return (
                <div
                  key={i}
                  className={`
                    h-8 w-8 rounded-full flex items-center justify-center text-sm
                    ${isToday ? 'bg-blue-600 text-white' : 
                      hasActivity ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-600'}
                  `}
                >
                  {Math.floor(Math.random() * 28) + 1}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-100 rounded-full"></div>
                <span className="text-gray-600">Study day</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-gray-600">Today</span>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700">View all activity</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;