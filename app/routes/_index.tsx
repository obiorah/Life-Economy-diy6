import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react"; // Import Link

export const meta: MetaFunction = () => {
  return [
    { title: "Life Economy - Dashboard" },
    { name: "description", content: "Welcome to Life Economy!" },
  ];
};

export default function Index() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <p className="mb-4">Welcome to your Life Economy dashboard.</p>
      {/* Placeholder for dashboard content */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <h2 className="mb-4 text-xl font-semibold">Overview</h2>
        <p>Your dashboard content will appear here.</p>
        <p className="mt-4">
          Navigate using the header links. Let's start with{" "}
          <Link to="/settings" className="text-blue-600 hover:underline dark:text-blue-400">
            Account Settings
          </Link>.
        </p>
      </div>
    </div>
  );
}
