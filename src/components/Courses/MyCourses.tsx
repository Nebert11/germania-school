import React, { useState, useEffect } from 'react';
import { enrollmentsApi } from '../../services/api';
import { Course } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Clock, Users, Star } from 'lucide-react';

const MyCourses: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!user?._id) return;
        const enrollments = await enrollmentsApi.getUserEnrollments(user._id, token || undefined);
        // Each enrollment has a 'course' field populated
        const enrolledCourses = enrollments.map((enrollment: any) => enrollment.course);
        setCourses(enrolledCourses);
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
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
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">My Courses</h2>
      {courses.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">You are not enrolled in any courses yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: Course) => {
            const thumbnail = course.thumbnail || 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1';
            const level = course.level || 'beginner';
            const type = course.type || 'live';
            const price = course.price !== undefined ? course.price : 0;
            const enrolledCount = Array.isArray(course.enrolledStudents)
              ? course.enrolledStudents.length
              : 0;
            return (
              <div key={course.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
                <img
                  src={thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      level === 'beginner' ? 'bg-green-100 text-green-800' :
                      level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {level}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      type === 'live' ? 'bg-blue-100 text-blue-800' :
                      type === 'recorded' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {type}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration || 'N/A'}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {enrolledCount} enrolled
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      4.8
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">${price}</span>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Continue Learning
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCourses; 