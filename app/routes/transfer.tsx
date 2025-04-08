import type { MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useState, useEffect, useMemo } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Life Economy - Transfer ESSENCE" },
    { name: "description", content: "Transfer ESSENCE to other users" },
  ];
};

// Define simple types for clarity
type User = {
  id: string;
  name: string;
  balance: number;
  avatar: string;
};

type Transaction = {
  id: string;
  amount: number;
  recipientId: string;
  recipientName: string;
  note?: string;
  timestamp: string;
};

// Generate dummy users
const generateUsers = (): User[] => {
  const names = ["Alex", "Jamie", "Taylor", "Morgan", "Casey", "Riley", "Jordan", "Quinn"];
  const surnames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis"];

  return Array.from({ length: 8 }, (_, i) => ({
    id: `user${i + 1000}`,
    name: `${names[i % names.length]} ${surnames[i % surnames.length]}`,
    balance: Math.floor(Math.random() * 10000) + 500,
    avatar: `https://i.pravatar.cc/150?img=${i + 10}`
  }));
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const amount = Number(formData.get("amount"));
  const recipientId = formData.get("recipient") as string;
  const note = formData.get("note") as string;

  // Validate inputs
  if (!amount || amount <= 0) {
    return json({ error: "Please enter a valid amount" }, { status: 400 });
  }

  if (!recipientId) {
    return json({ error: "Please select a recipient" }, { status: 400 });
  }

  // Get recipient name for success message
  const users = generateUsers();
  const recipient = users.find(u => u.id === recipientId);

  // In a real app, this would interact with your backend
  return json({
    success: true,
    message: `Successfully transferred ${amount} ESSENCE to ${recipient?.name || recipientId}`,
    transaction: {
      id: `tx${Date.now()}`,
      amount,
      recipientId,
      recipientName: recipient?.name || recipientId,
      note,
      timestamp: new Date().toISOString()
    }
  });
}

export default function Transfer() {
  const [users, setUsers] = useState<User[]>(generateUsers());
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>(""); // For controlled select
  const [recentTransfers, setRecentTransfers] = useState<Transaction[]>([]);
  const [formKey, setFormKey] = useState<number>(0); // Used to reset form
  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search term
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm) {
      return users;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return users.filter(user =>
      user.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      user.id.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [users, searchTerm]);

  useEffect(() => {
    if (actionData?.success) {
      // Refresh user data after successful transfer (optional, depends on real data source)
      // setUsers(generateUsers());

      // Add the new transaction to recent transfers
      setRecentTransfers(prev => [
        {
          id: actionData.transaction.id,
          amount: actionData.transaction.amount,
          recipientId: actionData.transaction.recipientId,
          recipientName: actionData.transaction.recipientName,
          note: actionData.transaction.note,
          timestamp: actionData.transaction.timestamp
        },
        ...prev.slice(0, 2) // Keep only the 3 most recent
      ]);

      // Reset form fields by changing the key
      setFormKey(prev => prev + 1);
      // Clear selected user and search term
      setSelectedUser(null);
      setSelectedUserId("");
      setSearchTerm("");
    }
  }, [actionData]);

  const handleRecipientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    const user = users.find(u => u.id === userId);
    setSelectedUser(user || null);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <h1 className="text-3xl font-bold">Transfer ESSENCE</h1>

      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        {actionData?.success ? (
          <div className="mb-6 rounded-md bg-green-50 p-4 text-green-800 dark:bg-green-900 dark:text-green-50">
            <p className="font-medium">{actionData.message}</p>
            <p className="mt-2 text-sm">
              Transaction ID: {actionData.transaction.id}
            </p>
          </div>
        ) : actionData?.error ? (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-red-800 dark:bg-red-900 dark:text-red-50">
            <p className="font-medium">{actionData.error}</p>
          </div>
        ) : null}

        <Form key={formKey} method="post" className="space-y-6">
          <div>
            <label htmlFor="search-recipient" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
              Search Recipient
            </label>
            <input
              type="text"
              id="search-recipient"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or ID..."
              className="mb-2 block w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <label htmlFor="recipient" className="sr-only"> {/* Screen reader only label */}
              Select Recipient
            </label>
            <select
              id="recipient"
              name="recipient"
              value={selectedUserId} // Controlled component
              className="block w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              onChange={handleRecipientChange}
              required
            >
              <option value="" disabled={!!selectedUserId}>Select a user</option> {/* Disable placeholder if a user is selected */}
              {filteredUsers.map((user) => (
                <option key={user.id} value={user.id} className="text-gray-900 dark:text-white"> {/* Ensure contrast */}
                  {user.name} ({user.id})
                </option>
              ))}
              {filteredUsers.length === 0 && searchTerm && (
                <option value="" disabled className="text-gray-500 dark:text-gray-400">No users found</option>
              )}
            </select>
          </div>

          {selectedUser && (
            <div className="flex items-center gap-4 rounded-md border p-4 dark:border-gray-700">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="h-12 w-12 rounded-full"
              />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{selectedUser.name}</h3>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="amount" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
              Amount (ESSENCE)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              min="1"
              step="1"
              className="block w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <label htmlFor="note" className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
              Note (Optional)
            </label>
            <textarea
              id="note"
              name="note"
              rows={3}
              className="block w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              placeholder="Add a note about this transfer"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting || !selectedUserId} // Disable if submitting or no recipient selected
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-blue-800 dark:hover:bg-blue-700 dark:focus:ring-blue-600 dark:focus:ring-offset-gray-950"
            >
              {isSubmitting ? "Processing..." : "Transfer ESSENCE"}
            </button>
          </div>
        </Form>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">Recent Transfers</h2>
        <div className="space-y-4">
          {recentTransfers.length > 0 ? (
            recentTransfers.map((transfer) => {
              // Find user data locally, fallback if user list changed or not found
              const user = users.find(u => u.id === transfer.recipientId) || {
                name: transfer.recipientName || `User ${transfer.recipientId}`,
                avatar: `https://i.pravatar.cc/150?u=${transfer.recipientId}` // Use ID for consistent placeholder avatar
              };
              return (
                <div key={transfer.id} className="flex items-center justify-between rounded-md border p-4 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <img
                      src={user.avatar}
                      alt="Recipient"
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{user.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(transfer.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600 dark:text-green-400">
                      -{transfer.amount} ESSENCE
                    </p>
                    {transfer.note && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {transfer.note}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            // Placeholder content if no recent transfers
            <p className="text-center text-gray-500 dark:text-gray-400">No recent transfers to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}
