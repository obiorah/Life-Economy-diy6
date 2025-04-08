import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Life Economy - Account Settings" },
    { name: "description", content: "Manage your account settings." },
  ];
};

export default function AccountSettings() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <h1 className="text-3xl font-bold">Account Settings</h1>

      {/* Profile Information Section */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h2 className="mb-1 text-xl font-semibold">Profile Information</h2>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Manage your account details and preferences
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Username
            </label>
            <p className="text-sm">johndoe</p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              User ID
            </label>
            <p className="text-sm">user123</p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Name
            </label>
            <p className="text-sm">John Doe</p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Email
            </label>
            <p className="text-sm">john.doe@example.com</p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Member Since
            </label>
            <p className="text-sm">1/12/2025</p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Notifications
            </label>
            <p className="text-sm">Enabled</p>
          </div>
        </div>
        <button className="mt-6 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-300 dark:focus:ring-offset-gray-950">
          Edit Profile
        </button>
      </div>

      {/* Security Section */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h2 className="mb-1 text-xl font-semibold">Security</h2>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Manage your password and security settings
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Password</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your password was last changed on 3/28/2025
            </p>
            <button className="mt-2 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              Change password
            </button>
          </div>
          <hr className="dark:border-gray-700" />
          <div>
            <h3 className="font-medium">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Add an extra layer of security to your account
            </p>
            <button className="mt-2 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              Enable two-factor authentication
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
