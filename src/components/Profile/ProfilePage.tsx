import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  // Local state for editable fields
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would call an API to save the changes
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-900 dark:text-gray-100 rounded shadow border border-gray-200 dark:border-gray-700 transition-colors">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Profile</h2>
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center space-x-6">
              <div>
                {(() => {
                  const fullName = `${firstName || user.firstName} ${lastName || user.lastName}`.trim();
                  const computedAvatar = avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=E5E7EB&color=111827&size=128`;
                  const fallbackAvatar = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="100%" height="100%" fill="%23e5e7eb"/><circle cx="64" cy="48" r="24" fill="%239ca3af"/><rect x="32" y="80" width="64" height="32" rx="16" fill="%239ca3af"/></svg>';
                  return (
                    <img
                      src={computedAvatar}
                      alt="avatar"
                      className="h-24 w-24 rounded-full object-cover border"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).onerror = null;
                        (e.currentTarget as HTMLImageElement).src = fallbackAvatar;
                      }}
                    />
                  );
                })()}
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="mt-2" />
              </div>
              <div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Email</label>
                  <input type="email" value={user.email} disabled className="w-full border rounded px-3 py-2 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300" />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium">Role</label>
                  <input type="text" value={user.role} disabled className="w-full border rounded px-3 py-2 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">Address</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                placeholder="Enter your address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
                placeholder="Enter your phone number"
              />
            </div>
            <div className="flex space-x-4">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">Save / Update Profile</button>
            </div>
            {success && <div className="text-green-600 font-medium">Profile updated!</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 