import type { User, Group, UserRole, UserStatus } from "~/types/admin";

export const mockGroups: Group[] = [
  { id: "g1", name: "Development Team" },
  { id: "g2", name: "Marketing Department" },
  { id: "g3", name: "Support Staff" },
  { id: "g4", name: "Unassigned" },
];

export const mockUsers: User[] = [
  {
    id: "u1",
    fullName: "Alice Wonderland",
    email: "alice@example.com",
    groupId: "g1",
    role: "Super Admin",
    status: "Active",
    balance: 1500,
    createdAt: "2023-10-01",
  },
  {
    id: "u2",
    fullName: "Bob The Builder",
    email: "bob@example.com",
    groupId: "g1",
    role: "Admin",
    status: "Active",
    balance: 800,
    createdAt: "2023-10-05",
  },
  {
    id: "u3",
    fullName: "Charlie Chaplin",
    email: "charlie@example.com",
    groupId: "g2",
    role: "User",
    status: "Active",
    balance: 350,
    createdAt: "2023-10-10",
  },
  {
    id: "u4",
    fullName: "Diana Prince",
    email: "diana@example.com",
    groupId: "g2",
    role: "User",
    status: "Suspended",
    balance: 50,
    createdAt: "2023-10-15",
  },
  {
    id: "u5",
    fullName: "Ethan Hunt",
    email: "ethan@example.com",
    groupId: "g3",
    role: "User",
    status: "Active",
    balance: 1200,
    createdAt: "2023-11-01",
  },
  {
    id: "u6",
    fullName: "Fiona Gallagher",
    email: "fiona@example.com",
    groupId: "g4",
    role: "Admin",
    status: "Active",
    balance: 950,
    createdAt: "2023-11-05",
  },
].map(user => ({
  ...user,
  // Add groupName based on groupId for easier display
  groupName: mockGroups.find(g => g.id === user.groupId)?.name || "Unknown Group",
}));

// Function to add a new user (simulates backend update)
export const addUser = (newUser: Omit<User, 'id' | 'groupName' | 'balance' | 'createdAt'>): User => {
  console.log("Attempting to add user:", newUser);
  const id = `u${mockUsers.length + 1}`;
  const groupName = mockGroups.find(g => g.id === newUser.groupId)?.name || "Unknown Group";
  const userWithDetails: User = {
    ...newUser,
    id,
    groupName,
    balance: 0, // Default balance
    createdAt: new Date().toISOString().split('T')[0], // Today's date
  };
  mockUsers.push(userWithDetails);
  console.log("User added, updated mockUsers:", mockUsers);
  return userWithDetails;
};

// Function to update a user (simulates backend update)
export const updateUser = (updatedUser: User): boolean => {
  const index = mockUsers.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    // Ensure groupName is updated if groupId changes
    const groupName = mockGroups.find(g => g.id === updatedUser.groupId)?.name || "Unknown Group";
    mockUsers[index] = { ...updatedUser, groupName };
    console.log("User updated:", mockUsers[index]);
    return true;
  }
  console.log("User not found for update:", updatedUser.id);
  return false;
};

// Function to delete a user (simulates backend update)
export const deleteUser = (userId: string): boolean => {
  const index = mockUsers.findIndex(u => u.id === userId);
  if (index !== -1) {
    mockUsers.splice(index, 1);
    console.log("User deleted:", userId);
    return true;
  }
  console.log("User not found for deletion:", userId);
  return false;
};
