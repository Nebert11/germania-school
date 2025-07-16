import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  return (
    <button
      type="button"
      className={`flex items-center px-3 py-2 rounded transition-colors border ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-200 text-gray-800 border-gray-300'}`}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  if (!user) return null;

  const [language, setLanguage] = useState('English');
  const [notifications, setNotifications] = useState({
    newCourses: false,
    forumReplies: false,
    liveReminders: false,
  });
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8 bg-white dark:bg-gray-900 dark:text-gray-100 rounded shadow border border-gray-200 dark:border-gray-700 transition-colors">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <form onSubmit={handleSave} className="space-y-8">
        {/* Account Settings */}
        <section>
          <h3 className="text-lg font-semibold mb-2">Account</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input type="email" value={user.email} disabled className="w-full border rounded px-3 py-2 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium">Change Password</label>
              <button className="mt-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800" type="button">Change Password</button>
            </div>
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input type="text" value={user.firstName + ' ' + user.lastName} disabled className="w-full border rounded px-3 py-2 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium">Avatar</label>
              <img src={user.avatar} alt="avatar" className="h-16 w-16 rounded-full object-cover" />
            </div>
          </div>
        </section>

        {/* Language & Appearance */}
        <section>
          <h3 className="text-lg font-semibold mb-2">Language & Appearance</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium">Preferred Language</label>
              <select className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300" value={language} onChange={e => setLanguage(e.target.value)}>
                <option>English</option>
                <option>German</option>
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium">Theme</label>
                <select className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300" value={theme} onChange={e => setTheme(e.target.value)}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section>
          <h3 className="text-lg font-semibold mb-2">Notifications</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" checked={notifications.newCourses} onChange={e => setNotifications(n => ({ ...n, newCourses: e.target.checked }))} />
              Email me about new courses
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" checked={notifications.forumReplies} onChange={e => setNotifications(n => ({ ...n, forumReplies: e.target.checked }))} />
              Email me about forum replies
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" checked={notifications.liveReminders} onChange={e => setNotifications(n => ({ ...n, liveReminders: e.target.checked }))} />
              Remind me about live classes
            </label>
          </div>
        </section>

        {/* Privacy & Security */}
        <section>
          <h3 className="text-lg font-semibold mb-2">Privacy & Security</h3>
          <div className="space-y-2">
            <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" type="button">Enable Two-Factor Authentication</button>
            <button className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200" type="button">Delete Account</button>
          </div>
        </section>

        {/* Role-specific settings */}
        {user.role === 'admin' && (
          <section>
            <h3 className="text-lg font-semibold mb-2">Admin Settings</h3>
            <div className="space-y-2">
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200" type="button">Manage Users</button>
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200" type="button">Manage Courses</button>
              <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" type="button">Platform Settings</button>
            </div>
          </section>
        )}
        {user.role === 'teacher' && (
          <section>
            <h3 className="text-lg font-semibold mb-2">Teacher Settings</h3>
            <div className="space-y-2">
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200" type="button">My Courses</button>
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200" type="button">Student Management</button>
            </div>
          </section>
        )}
        {user.role === 'student' && (
          <section>
            <h3 className="text-lg font-semibold mb-2">Student Settings</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Learning reminders
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Make my progress public
              </label>
            </div>
          </section>
        )}
        <div className="pt-4">
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Settings</button>
          {success && <span className="ml-4 text-green-600 font-medium">Settings saved!</span>}
        </div>
      </form>
    </div>
  );
};

export default SettingsPage; 