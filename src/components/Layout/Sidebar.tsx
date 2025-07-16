import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  Users, 
  Settings, 
  Video,
  Brain,
  Award
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const studentNavItems = [
    { icon: Home, label: 'Dashboard', href: '#dashboard' },
    { icon: BookOpen, label: 'My Courses', href: '#courses' },
    { icon: Calendar, label: 'Schedule', href: '#schedule' },
    { icon: Brain, label: 'Vocabulary', href: '#vocabulary' },
    { icon: Video, label: 'Live Classes', href: '#live' },
    { icon: MessageSquare, label: 'Forum', href: '#forum' },
    { icon: BarChart3, label: 'Progress', href: '#progress' },
    { icon: Award, label: 'Achievements', href: '#achievements' },
  ];

  const teacherNavItems = [
    { icon: Home, label: 'Dashboard', href: '#dashboard' },
    { icon: BookOpen, label: 'My Courses', href: '#courses' },
    { icon: Users, label: 'Students', href: '#students' },
    { icon: Calendar, label: 'Schedule', href: '#schedule' },
    { icon: Video, label: 'Live Classes', href: '#live' },
    { icon: MessageSquare, label: 'Forum', href: '#forum' },
    { icon: BarChart3, label: 'Analytics', href: '#analytics' },
  ];

  const adminNavItems = [
    { icon: Home, label: 'Dashboard', href: '#dashboard' },
    { icon: Users, label: 'Users', href: '#users' },
    { icon: BookOpen, label: 'Courses', href: '#courses' },
    { icon: BarChart3, label: 'Analytics', href: '#analytics' },
    { icon: Settings, label: 'Settings', href: '#settings' },
  ];

  const getNavItems = () => {
    switch (user?.role) {
      case 'teacher':
        return teacherNavItems;
      case 'admin':
        return adminNavItems;
      default:
        return studentNavItems;
    }
  };

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <div className="space-y-2">
          {getNavItems().map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group"
            >
              <item.icon className="h-5 w-5 group-hover:text-blue-600" />
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;