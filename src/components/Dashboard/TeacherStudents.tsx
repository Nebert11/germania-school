import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { coursesApi, usersApi } from '../../services/api';
import { Course, User } from '../../types';
import { Users, BookOpen } from 'lucide-react';

interface StudentWithCourses extends User {
  enrolledCourseIds: string[];
}

const TeacherStudents: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<User[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [allCourses, allUsers] = await Promise.all([
          coursesApi.getAllCourses(),
          usersApi.getAllUsers()
        ]);

        const teacherId = user?._id || user?.id;
        const myCourses = allCourses.filter((c: any) => {
          const courseTeacherId = c.teacherId || c.teacher?._id || c.teacher?.id;
          return courseTeacherId === teacherId;
        });
        setCourses(myCourses);

        const onlyStudents = allUsers.filter(u => u.role === 'student');
        setStudents(onlyStudents);
      } catch (e) {
        console.error('Failed to load students/courses', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const studentIdToCourses = useMemo(() => {
    const map = new Map<string, Course[]>();
    for (const course of courses) {
      const enrolled = (course as any).enrolledStudents || [];
      for (const studentId of enrolled) {
        if (!map.has(studentId)) map.set(studentId, []);
        map.get(studentId)!.push(course);
      }
    }
    return map;
  }, [courses]);

  const studentsWithEnrollments: StudentWithCourses[] = useMemo(() => {
    return students
      .map((s) => {
        const studentId = (s as any)._id || s.id;
        const enrolledCourses = studentIdToCourses.get(studentId) || [];
        return {
          ...s,
          enrolledCourseIds: enrolledCourses.map((c: any) => c._id || c.id)
        } as StudentWithCourses;
      })
      .filter((s) => s.enrolledCourseIds.length > 0);
  }, [students, studentIdToCourses]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 dark:text-gray-100 rounded shadow border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-6">
        <Users className="h-8 w-8 text-blue-600" />
        <h2 className="text-2xl font-bold ml-3">Students</h2>
      </div>

      {studentsWithEnrollments.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No students enrolled in your courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentsWithEnrollments.map((student) => {
            const studentKey = (student as any)._id || student.id;
            const enrolledCourses = studentIdToCourses.get(studentKey) || [];
            return (
              <div key={studentKey} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
                <div className="flex items-center mb-3">
                  <img
                    src={student.avatar || 'https://via.placeholder.com/64'}
                    alt={`${student.firstName} ${student.lastName}`}
                    className="h-10 w-10 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-xs text-gray-500">{student.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Enrolled courses</p>
                  <ul className="space-y-2">
                    {enrolledCourses.map((course) => (
                      <li key={course.id} className="flex items-center text-sm text-gray-700 dark:text-gray-200">
                        <BookOpen className="h-4 w-4 text-blue-600 mr-2" />
                        <span>{course.title}</span>
                        <span className="ml-auto text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full">{course.level}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherStudents;


