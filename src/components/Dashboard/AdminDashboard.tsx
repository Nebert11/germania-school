import React, { useState, useEffect, useMemo } from 'react';
import { coursesApi, usersApi } from '../../services/api';
import { Course, User } from '../../types';
import { Users, BookOpen, TrendingUp, DollarSign, UserPlus, Settings, BarChart3 } from 'lucide-react';
import { analyticsApi } from '../../services/api';

const AdminDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [assigning, setAssigning] = useState(false);
  const [completionRate, setCompletionRate] = useState<number>(0);

  useEffect(() => { 
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || undefined;
        const [coursesData, usersData, comp] = await Promise.all([
          coursesApi.getAllCourses(),
          usersApi.getAllUsers(token),
          analyticsApi.getCompletionRate(token)
        ]);
        setCourses(coursesData);
        setUsers(usersData);
        setCompletionRate(comp);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const teachers = useMemo(() => users.filter(u => u.role === 'teacher'), [users]);

  const handleAssignTeacher = async () => {
    if (!selectedCourseId || !selectedTeacherId) return;
    try {
      setAssigning(true);
      const token = localStorage.getItem('token') || undefined;
      await coursesApi.assignTeacher(selectedCourseId, selectedTeacherId, token);
      const refreshed = await coursesApi.getAllCourses();
      setCourses(refreshed);
      setSelectedCourseId('');
      setSelectedTeacherId('');
    } catch (err) {
      console.error('Error assigning teacher:', err);
      alert('Failed to assign teacher');
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalStudents = courses.reduce((sum, c: any) => sum + ((c.enrolledStudents?.length) || 0), 0);
  const totalUsers = users.length;
  const totalRevenue = courses.reduce((sum, c: any) => sum + (((c.price || 0) * ((c.enrolledStudents?.length) || 0))), 0);

  return (
    <div className="p-8 bg-white dark:bg-gray-900 dark:text-gray-100 rounded shadow border border-gray-200 dark:border-gray-700 transition-colors">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Admin Dashboard</h2>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Manage your platform and monitor performance</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Users: {totalUsers} • Courses: {courses.length} • Students: {totalStudents}</p>
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </button>
        </div>
      </div>

      {/* Assign Teacher to Course */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors mb-8">
        <h3 className="text-lg font-semibold mb-4">Assign Teacher to Course</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 dark:text-gray-100"
          >
            <option value="">Select course</option>
            {courses.map((c: any) => (
              <option key={c._id || c.id} value={c._id || c.id}>{c.title}</option>
            ))}
          </select>
          <select
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 dark:text-gray-100"
          >
            <option value="">Select teacher</option>
            {teachers.map((t: any) => (
              <option key={t._id || t.id} value={t._id || t.id}>
                {t.firstName} {t.lastName}
              </option>
            ))}
          </select>
          <button
            onClick={handleAssignTeacher}
            disabled={!selectedCourseId || !selectedTeacherId || assigning}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {assigning ? 'Assigning...' : 'Assign'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalUsers}</p>
              <p className="text-sm text-green-600 mt-1">↗ 12% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Courses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{courses.length}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">↗ 2 new this month</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">${totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">↗ 18% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{Math.round(completionRate)}%</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">↗ 5% from last month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Recent Users</h2>
            <div className="space-y-4">
              {users.slice(-5).reverse().map((u) => {
                const fullName = `${u.firstName} ${u.lastName}`.trim();
                const avatarUrl = u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=E5E7EB&color=111827&size=64`;
                const fallbackAvatar = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="100%" height="100%" fill="%23e5e7eb"/><circle cx="32" cy="24" r="12" fill="%239ca3af"/><rect x="16" y="40" width="32" height="16" rx="8" fill="%239ca3af"/></svg>';
                return (
                <div key={u._id || u.id} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <img
                    src={avatarUrl}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).onerror = null; (e.currentTarget as HTMLImageElement).src = fallbackAvatar; }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{u.firstName} {u.lastName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{u.role}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${u.role === 'teacher' ? 'bg-blue-100 text-blue-800' : u.role === 'student' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>{u.role}</span>
                </div>
              );})}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Course Performance</h2>
            <div className="space-y-4">
              {courses.slice(0, 3).map((course) => (
                <div key={(course as any)._id || course.id} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{course.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{course.enrolledStudents?.length || 0} students</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">92%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">completion</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Analytics Overview</h2>
            <button className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Details
            </button>
          </div>
          <div className="h-64 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Chart placeholder - Analytics data would be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;