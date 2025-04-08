export type UserRole = "Super Admin" | "Admin" | "User";
export type UserStatus = "Active" | "Suspended";

// Mock Group Type (replace with actual data structure later)
export interface Group {
  id: string;
  name: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  groupId: string; // Reference to Group id
  groupName?: string; // Denormalized for display, populated later
  role: UserRole;
  status: UserStatus;
  // Add other relevant fields later (e.g., balance, createdAt)
  balance?: number; // Example
  createdAt?: string; // Example
}

// For Bulk Upload Validation
export interface BulkUploadResult {
  successCount: number;
  errors: { row: number; message: string }[];
}
