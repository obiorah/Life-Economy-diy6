import React, { useState, useMemo } from 'react';
import { mockGroups, mockUsers } from '~/lib/mockData'; // Use existing mocks
import type { Group, User } from '~/types/admin';
import { ConfirmationModal } from './ConfirmationModal'; // Re-use confirmation

// --- Icons ---
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
  );
}
function EditIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
  );
}
function DeleteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
  );
}
function ViewIcon(props: React.SVGProps<SVGSVGElement>) { // Eye icon
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
  );
}
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  );
}

// Placeholder Type - Extend Group if needed
interface ManagedGroup extends Group {
  description?: string;
  type?: string; // e.g., Squad, Academic Group, Team
  userCount?: number; // Calculated
}

// Placeholder Modals (Implement fully later)
function AddEditGroupModal({ isOpen, onClose, group, onSave }: { isOpen: boolean, onClose: () => void, group: ManagedGroup | null, onSave: (groupData: Omit<ManagedGroup, 'id' | 'userCount'>) => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setName(group?.name || '');
      setDescription(group?.description || '');
      setType(group?.type || '');
      setError('');
    }
  }, [isOpen, group]);

  const handleSave = () => {
    if (!name.trim()) {
      setError('Group Name is required.');
      return;
    }
    // Add uniqueness check if needed
    onSave({ name: name.trim(), description: description.trim(), type: type.trim() });
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{group ? 'Edit Group' : 'Add New Group'}</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <div className="space-y-4">
          <div>
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Group Name <span className="text-red-500">*</span></label>
            <input type="text" id="groupName" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label htmlFor="groupDesc" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea id="groupDesc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
          <div>
            <label htmlFor="groupType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Group Type</label>
            <input type="text" id="groupType" value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g., Squad, Team" className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{group ? 'Update Group' : 'Add Group'}</button>
        </div>
      </div>
    </div>
  );
}

function ViewMembersModal({ isOpen, onClose, group, users }: { isOpen: boolean, onClose: () => void, group: ManagedGroup | null, users: User[] }) {
  if (!isOpen || !group) return null;
  const members = users.filter(u => u.groupId === group.id);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[80vh] flex flex-col">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Members of {group.name} ({members.length})</h2>
        <div className="flex-grow overflow-y-auto mb-4 border dark:border-gray-700 rounded">
          {members.length === 0 ? (
            <p className="p-4 text-gray-500 dark:text-gray-400">No users found in this group.</p>
          ) : (
            <ul className="divide-y dark:divide-gray-700">
              {members.map(user => (
                <li key={user.id} className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                  {user.fullName} ({user.email}) - {user.role}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Close</button>
        </div>
      </div>
    </div>
  );
}


export function GroupsManagement() {
  // Simulate fetching groups and users - replace with actual data fetching
  const [allUsers] = useState<User[]>(mockUsers);
  const [groups, setGroups] = useState<ManagedGroup[]>(() =>
    mockGroups.map(g => ({
      ...g,
      description: `Description for ${g.name}`, // Placeholder
      type: ['Squad', 'Team', 'Academic Group', 'Other'][Math.floor(Math.random() * 4)], // Placeholder
      userCount: allUsers.filter(u => u.groupId === g.id).length,
    }))
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewMembersModalOpen, setIsViewMembersModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ManagedGroup | null>(null);

  const groupTypes = useMemo(() => [...new Set(groups.map(g => g.type).filter(Boolean))], [groups]) as string[];

  const filteredGroups = useMemo(() => {
    return groups.filter(group => {
      const searchMatch = searchTerm === '' || group.name.toLowerCase().includes(searchTerm.toLowerCase());
      const typeMatch = filterType === '' || group.type === filterType;
      return searchMatch && typeMatch;
    });
  }, [groups, searchTerm, filterType]);

  // --- Placeholder Action Handlers ---
  const handleAddGroup = () => {
    setSelectedGroup(null);
    setIsAddEditModalOpen(true);
  };

  const handleEditGroup = (group: ManagedGroup) => {
    setSelectedGroup(group);
    setIsAddEditModalOpen(true);
  };

  const handleSaveGroup = (groupData: Omit<ManagedGroup, 'id' | 'userCount'>) => {
    if (selectedGroup) {
      // Edit existing
      setGroups(prev => prev.map(g => g.id === selectedGroup.id ? { ...selectedGroup, ...groupData } : g));
      console.log("Updated group:", { ...selectedGroup, ...groupData });
      // TODO: Show success toast
    } else {
      // Add new
      const newGroup: ManagedGroup = {
        ...groupData,
        id: `g${Date.now()}`, // Simple unique ID generation
        userCount: 0,
      };
      setGroups(prev => [...prev, newGroup]);
      console.log("Added group:", newGroup);
      // TODO: Show success toast
    }
  };

  const handleDeleteGroup = (group: ManagedGroup) => {
    setSelectedGroup(group);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteGroup = () => {
    if (selectedGroup) {
      // Add check: Cannot delete group if it has members? Or reassign members?
      if (selectedGroup.userCount && selectedGroup.userCount > 0) {
         alert(`Cannot delete group "${selectedGroup.name}" because it has ${selectedGroup.userCount} member(s). Please reassign users first.`);
         setIsDeleteModalOpen(false);
         setSelectedGroup(null);
         return;
      }
      setGroups(prev => prev.filter(g => g.id !== selectedGroup.id));
      console.log("Deleted group:", selectedGroup.id);
      // TODO: Show success toast
      setIsDeleteModalOpen(false);
      setSelectedGroup(null);
    }
  };

  const handleViewMembers = (group: ManagedGroup) => {
    setSelectedGroup(group);
    setIsViewMembersModalOpen(true);
  };

  return (
    <div className="p-4 border rounded-md dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Groups Management</h3>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <button
          onClick={handleAddGroup}
          className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          <PlusIcon className="h-4 w-4" />
          Add New Group
        </button>
        <div className="flex gap-2 flex-wrap">
          {/* Search */}
          <div className="relative">
            <label htmlFor="search-groups" className="sr-only">Search by group name</label>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="search-groups"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-auto pl-10 pr-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          {/* Filter by Type */}
          <div>
            <label htmlFor="filter-group-type" className="sr-only">Filter by Group Type</label>
            <select
              id="filter-group-type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Types</option>
              {groupTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Groups Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Group Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">User Count</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
            {filteredGroups.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No groups found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredGroups.map((group) => (
                <tr key={group.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{group.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{group.type || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{group.userCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                    <button onClick={() => handleViewMembers(group)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 p-1" title="View Members">
                      <ViewIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleEditGroup(group)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 p-1" title="Edit Group">
                      <EditIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDeleteGroup(group)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 p-1" title="Delete Group">
                      <DeleteIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AddEditGroupModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        group={selectedGroup}
        onSave={handleSaveGroup}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setSelectedGroup(null); }}
        onConfirm={confirmDeleteGroup}
        title="Confirm Group Deletion"
        message={
          <span>Are you sure you want to delete the group <strong>{selectedGroup?.name}</strong>? This action cannot be undone{selectedGroup?.userCount && selectedGroup.userCount > 0 ? ' and the group currently has members' : ''}.</span>
        }
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
      <ViewMembersModal
        isOpen={isViewMembersModalOpen}
        onClose={() => { setIsViewMembersModalOpen(false); setSelectedGroup(null); }}
        group={selectedGroup}
        users={allUsers}
      />
    </div>
  );
}
