// Placeholder for Edit User Modal
import React, { useState, useEffect } from 'react';
import type { User, Group, UserRole, UserStatus } from '~/types/admin';
import { mockGroups } from '~/lib/mockData';

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (updatedUser: User) => void;
}

export function EditUserModal({ user, isOpen, onClose, onUpdateUser }: EditUserModalProps) {
 const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [groupId, setGroupId] = useState<string>('');
  const [role, setRole] = useState<UserRole>('User');
  const [status, setStatus] = useState<UserStatus>('Active');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Pre-fill form when user data is available and modal opens
    if (user && isOpen) {
      setFullName(user.fullName);
      setEmail(user.email);
      setGroupId(user.groupId);
      setRole(user.role);
      setStatus(user.status);
      setErrors({}); // Clear previous errors
    }
     // Reset form when modal closes or user is null
    if (!isOpen) {
        setFullName('');
        setEmail('');
        setGroupId('');
        setRole('User');
        setStatus('Active');
        setErrors({});
    }
  }, [user, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid.';
    }
    // Add check for email uniqueness against OTHER users if needed
    if (!groupId) newErrors.group = 'Group is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user && validateForm()) {
      onUpdateUser({
        ...user, // Keep existing id, balance, etc.
        fullName,
        email,
        groupId,
        role,
        status,
      });
      onClose(); // Close the modal
    }
  };


  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Edit User: {user.fullName}</h2>
         <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="mb-4">
            <label htmlFor="editFullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              id="editFullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              required
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="editEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email <span className="text-red-500">*</span></label>
            <input
              type="email"
              id="editEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              required
            />
             {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Group */}
          <div className="mb-4">
            <label htmlFor="editGroup" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Group <span className="text-red-500">*</span></label>
            <select
              id="editGroup"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.group ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
              required
            >
              {mockGroups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
             {errors.group && <p className="text-red-500 text-xs mt-1">{errors.group}</p>}
          </div>

          {/* Role */}
          <div className="mb-4">
            <label htmlFor="editRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <select
              id="editRole"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>

          {/* Status */}
          <div className="mb-6">
            <label htmlFor="editStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              id="editStatus"
              value={status}
              onChange={(e) => setStatus(e.target.value as UserStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
