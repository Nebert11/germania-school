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

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const studentNavItems = [
    { icon: Home, label: 'Dashboard', href: '#dashboard' },
    { icon: BookOpen, label: 'My Courses', href: '#my-courses' },
    { icon: Calendar, label: 'Schedule', href: '#schedule' },
    { icon: Brain, label: 'Vocabulary', href: '#vocabulary' },
    { icon: Video, label: 'Live Classes', href: '#live' },
    { icon: MessageSquare, label: 'Forum', href: '#forum' },
    { icon: BarChart3, label: 'Progress', href: '#progress' },
    { icon: Award, label: 'Achievements', href: '#achievements' },
  ];

  const teacherNavItems = [
    { icon: Home, label: 'Dashboard', href: '#dashboard' },
    { icon: BookOpen, label: 'My Courses', href: '#my-courses' },
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
    <>
      {/* Mobile overlay */}
      <div
        className={`${isOpen ? 'fixed' : 'hidden'} inset-0 bg-black/40 z-40 md:hidden`}
        onClick={onClose}
      />

      <aside
        className={`transform transition-transform duration-200 ease-in-out w-64 bg-white dark:bg-gray-900 shadow-sm border-r border-gray-200 dark:border-gray-700 min-h-screen z-50 fixed inset-y-0 left-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0`}
      >
        <div className="p-4">
          <div className="space-y-2">
            {getNavItems().map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={onClose}
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
              >
                <item.icon className="h-5 w-5 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;