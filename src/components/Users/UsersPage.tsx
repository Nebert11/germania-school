import React, { useEffect, useMemo, useState } from 'react';
import { usersApi } from '../../services/api';
import { User } from '../../types';
import { Users, UserCheck, UserX } from 'lucide-react';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await usersApi.getAllUsers();
        setUsers(list);
      } catch (e) {
        console.error('Failed to fetch users', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white dark:bg-gray-900 dark:text-gray-100 rounded shadow border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Users</h2>
        <div className="flex space-x-3 text-sm">
          <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full"><UserCheck className="h-4 w-4 mr-1" /> Active: {activeUsers}</span>
          <span className="inline-flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full"><Users className="h-4 w-4 mr-1" /> Total: {totalUsers}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u) => {
          const fullName = `${u.firstName} ${u.lastName}`.trim();
          const avatarUrl = u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=E5E7EB&color=111827&size=64`;
          const fallbackAvatar = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="100%" height="100%" fill="%23e5e7eb"/><circle cx="32" cy="24" r="12" fill="%239ca3af"/><rect x="16" y="40" width="32" height="16" rx="8" fill="%239ca3af"/></svg>';
          return (
          <div key={u._id || u.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
            <div className="flex items-center mb-3">
              <img src={avatarUrl} alt="avatar" className="h-10 w-10 rounded-full object-cover mr-3" onError={(e) => { (e.currentTarget as HTMLImageElement).onerror = null; (e.currentTarget as HTMLImageElement).src = fallbackAvatar; }} />
              <div className="truncate">
                <div className="font-semibold">{u.firstName} {u.lastName}</div>
                <div className="text-xs text-gray-500 truncate">{u.email}</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">{u.role}</span>
              <span className={`px-2 py-0.5 rounded-full ${u.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                {u.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        );})}
      </div>
    </div>
  );
};

export default UsersPage; 