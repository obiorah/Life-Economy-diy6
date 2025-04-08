import React, { useState, useMemo, useCallback } from 'react';
import { UsersTable } from './UsersTable';
import { AddUserModal } from './AddUserModal';
import { BulkUploadModal } from './BulkUploadModal';
import { ConfirmationModal } from './ConfirmationModal';
import { UserProfileView } from './UserProfileView';
import { EditUserModal } from './EditUserModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import { mockUsers, mockGroups, addUser, updateUser, deleteUser } from '~/lib/mockData';
import type { User, Group, UserRole, UserStatus, BulkUploadResult } from '~/types/admin';

// --- Icons ---
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
  );
}
function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
  );
}
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  );
}


export function UsersTabContent() {
  const [users, setUsers] = useState<User[]>(mockUsers); // Manage users in state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>(''); // Group ID
  const [filterRole, setFilterRole] = useState<UserRole | ''>('');
  const [filterStatus, setFilterStatus] = useState<UserStatus | ''>('');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProfileViewOpen, setIsProfileViewOpen] = useState(false);

  // State for selected user for actions
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Memoized filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const searchMatch = searchTerm === '' ||
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const groupMatch = filterGroup === '' || user.groupId === filterGroup;
      const roleMatch = filterRole === '' || user.role === filterRole;
      const statusMatch = filterStatus === '' || user.status === filterStatus;
      return searchMatch && groupMatch && roleMatch && statusMatch;
    });
  }, [users, searchTerm, filterGroup, filterRole, filterStatus]);

  // --- Action Handlers ---
  const handleAddUser = useCallback((newUser: Omit<User, 'id' | 'groupName' | 'balance' | 'createdAt'>) => {
    const addedUser = addUser(newUser); // Use mockData function
    setUsers(prevUsers => [...prevUsers, addedUser]); // Update state
    // TODO: Show success notification "User '[Name]' added successfully."
    console.log(`User '${addedUser.fullName}' added successfully.`);
    setIsAddModalOpen(false);
  }, []);

  const handleBulkUpload = useCallback((newUsers: Omit<User, 'id' | 'groupName' | 'balance' | 'createdAt'>[]): BulkUploadResult => {
    // Simulate backend processing and adding users
    let successCount = 0;
    const addedUsers: User[] = [];
    const errors: { row: number; message: string }[] = []; // In a real scenario, backend would return errors

    newUsers.forEach((newUser, index) => {
      // Basic check for duplicates within the upload batch (more robust check needed against existing users)
      if (users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase()) || addedUsers.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
         errors.push({ row: index + 2, message: `Email '${newUser.email}' already exists.` }); // +2 for header and 0-index
      } else {
        const addedUser = addUser(newUser); // Use mockData function to add one by one
        addedUsers.push(addedUser);
        successCount++;
      }
    });

    if (addedUsers.length > 0) {
      setUsers(prevUsers => [...prevUsers, ...addedUsers]); // Update state with successfully added users
    }

    console.log(`Bulk upload processed: ${successCount} successes, ${errors.length} errors.`);
    // In a real app, you might not close the modal immediately, showing results first.
    // setIsBulkModalOpen(false); // Keep modal open to show results
    return { successCount, errors };
  }, [users]); // Depend on current users for duplicate check

  const handleEditUser = useCallback((userToEdit: User) => {
    setSelectedUser(userToEdit);
    setIsEditModalOpen(true);
  }, []);

   const handleUpdateUser = useCallback((updatedUserData: User) => {
    const success = updateUser(updatedUserData); // Use mockData function
    if (success) {
      setUsers(prevUsers => prevUsers.map(u => u.id === updatedUserData.id ? updatedUserData : u));
      // TODO: Show success notification
      console.log(`User '${updatedUserData.fullName}' updated successfully.`);
    } else {
       // TODO: Show error notification
       console.error(`Failed to update user '${updatedUserData.fullName}'.`);
    }
    setIsEditModalOpen(false);
    setSelectedUser(null);
  }, []);


  const handleDeleteUser = useCallback((userToDelete: User) => {
    setSelectedUser(userToDelete);
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDeleteUser = useCallback(() => {
    if (selectedUser) {
      const success = deleteUser(selectedUser.id); // Use mockData function
      if (success) {
        setUsers(prevUsers => prevUsers.filter(u => u.id !== selectedUser.id));
        // TODO: Show success notification
        console.log(`User '${selectedUser.fullName}' deleted successfully.`);
      } else {
         // TODO: Show error notification
         console.error(`Failed to delete user '${selectedUser.fullName}'.`);
      }
      setSelectedUser(null);
    }
    setIsDeleteModalOpen(false); // Close modal regardless of success/failure for now
  }, [selectedUser]);

  const handleSuspendUser = useCallback((userToSuspend: User) => {
    setSelectedUser(userToSuspend);
    setIsSuspendModalOpen(true);
  }, []);

  const confirmSuspendUser = useCallback(() => {
    if (selectedUser) {
       const updatedUser = { ...selectedUser, status: 'Suspended' as UserStatus };
       const success = updateUser(updatedUser);
       if (success) {
         setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
         // TODO: Show success notification
         console.log(`User '${selectedUser.fullName}' suspended successfully.`);
       } else {
          // TODO: Show error notification
          console.error(`Failed to suspend user '${selectedUser.fullName}'.`);
       }
       setSelectedUser(null);
    }
    setIsSuspendModalOpen(false);
  }, [selectedUser]);

  const handleRestoreUser = useCallback((userToRestore: User) => {
    setSelectedUser(userToRestore);
    setIsRestoreModalOpen(true);
  }, []);

  const confirmRestoreUser = useCallback(() => {
     if (selectedUser) {
       const updatedUser = { ...selectedUser, status: 'Active' as UserStatus };
       const success = updateUser(updatedUser);
       if (success) {
         setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
         // TODO: Show success notification
         console.log(`User '${selectedUser.fullName}' restored successfully.`);
       } else {
          // TODO: Show error notification
          console.error(`Failed to restore user '${selectedUser.fullName}'.`);
       }
       setSelectedUser(null);
    }
    setIsRestoreModalOpen(false);
  }, [selectedUser]);

  const handleChangePassword = useCallback((userToChangePass: User) => {
    setSelectedUser(userToChangePass);
    setIsPasswordModalOpen(true);
  }, []);

   const confirmChangePassword = useCallback((userId: string, newPassword: string) => {
    // In a real app, this would call an API endpoint.
    // Here, we just log it.
    console.log(`Password change initiated for user ID: ${userId} with new password: ${newPassword}`);
    // TODO: Show success notification
    setIsPasswordModalOpen(false);
    setSelectedUser(null);
  }, []);

  const handleViewProfile = useCallback((userToView: User) => {
    setSelectedUser(userToView);
    setIsProfileViewOpen(true);
  }, []);


  return (
    <div className="p-4 border rounded-b-md dark:border-gray-700 bg-white dark:bg-gray-900">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Management</h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            <PlusIcon className="h-4 w-4" />
            Add New User
          </button>
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            <UploadIcon className="h-4 w-4" />
            Bulk Upload Users
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md border dark:border-gray-700">
        {/* Search */}
        <div className="relative">
           <label htmlFor="search-users" className="sr-only">Search by name or email</label>
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <SearchIcon className="h-5 w-5 text-gray-400" />
           </div>
           <input
            type="text"
            id="search-users"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {/* Filter by Group */}
        <div>
          <label htmlFor="filter-group" className="sr-only">Filter by Group</label>
          <select
            id="filter-group"
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Groups</option>
            {mockGroups.map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </div>
        {/* Filter by Role */}
        <div>
           <label htmlFor="filter-role" className="sr-only">Filter by Role</label>
           <select
            id="filter-role"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as UserRole | '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
        </div>
        {/* Filter by Status */}
        <div>
           <label htmlFor="filter-status" className="sr-only">Filter by Status</label>
           <select
            id="filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as UserStatus | '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <UsersTable
        users={filteredUsers}
        onViewProfile={handleViewProfile}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onSuspend={handleSuspendUser}
        onRestore={handleRestoreUser}
        onChangePassword={handleChangePassword}
      />

      {/* Modals */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddUser={handleAddUser}
      />
      <BulkUploadModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onBulkUpload={handleBulkUpload}
      />
       <EditUserModal
        isOpen={isEditModalOpen}
        user={selectedUser}
        onClose={() => { setIsEditModalOpen(false); setSelectedUser(null); }}
        onUpdateUser={handleUpdateUser}
      />
       <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setSelectedUser(null); }}
        onConfirm={confirmDeleteUser}
        title="Confirm Deletion"
        message={
          <span>Are you sure you want to delete user <strong>{selectedUser?.fullName}</strong>? This action cannot be undone.</span>
        }
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
       <ConfirmationModal
        isOpen={isSuspendModalOpen}
        onClose={() => { setIsSuspendModalOpen(false); setSelectedUser(null); }}
        onConfirm={confirmSuspendUser}
        title="Confirm Suspension"
        message={
          <span>Are you sure you want to suspend user <strong>{selectedUser?.fullName}</strong>? They will lose access until restored.</span>
        }
        confirmText="Suspend"
        confirmButtonClass="bg-yellow-600 hover:bg-yellow-700"
      />
       <ConfirmationModal
        isOpen={isRestoreModalOpen}
        onClose={() => { setIsRestoreModalOpen(false); setSelectedUser(null); }}
        onConfirm={confirmRestoreUser}
        title="Confirm Restoration"
        message={
          <span>Are you sure you want to restore access for user <strong>{selectedUser?.fullName}</strong>?</span>
        }
        confirmText="Restore"
        confirmButtonClass="bg-green-600 hover:bg-green-700"
      />
       <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        user={selectedUser}
        onClose={() => { setIsPasswordModalOpen(false); setSelectedUser(null); }}
        onChangePassword={confirmChangePassword}
      />
       <UserProfileView
        isOpen={isProfileViewOpen}
        user={selectedUser}
        onClose={() => { setIsProfileViewOpen(false); setSelectedUser(null); }}
      />

    </div>
  );
}
