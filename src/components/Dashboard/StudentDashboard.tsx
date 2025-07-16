import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { enrollmentsApi, progressApi } from '../../services/api';
import { Course, Progress } from '../../types';
import { BookOpen, Clock, Trophy, Calendar, TrendingUp, Play } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!user?._id) return;
        const [enrollments, progressData] = await Promise.all([
          enrollmentsApi.getUserEnrollments(user._id, token || undefined),
          progressApi.getProgress(user._id)
        ]);
        // Each enrollment has a 'course' field populated
        const enrolledCourses = enrollments.map((enrollment: any) => enrollment.course);
        setCourses(enrolledCourses);
        setProgress(progressData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?._id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white dark:bg-gray-900 dark:text-gray-100 rounded shadow border border-gray-200 dark:border-gray-700 transition-colors">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Student Dashboard</h2>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome back, {user?.firstName}!</h1>
        <p className="text-gray-600 mt-2">Continue your German learning journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Enrolled Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{courses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Study Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">24h</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center">
            <Trophy className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Achievements</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">8</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">87%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Continue Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course: Course) => (
              <div key={course._id || course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Progress</span>
                        <span className="text-gray-700">65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <button className="mt-3 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                      <Play className="h-4 w-4 mr-1" />
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Classes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Classes</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Conversation Practice</h3>
                <p className="text-sm text-gray-600">Advanced German Conversation</p>
                <p className="text-sm text-blue-600 mt-1">Today at 2:00 PM</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Join Class
              </button>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Grammar Review</h3>
                <p className="text-sm text-gray-600">German for Beginners</p>
                <p className="text-sm text-green-600 mt-1">Tomorrow at 10:00 AM</p>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Set Reminder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;