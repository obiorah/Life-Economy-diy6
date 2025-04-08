import type { MetaFunction } from "@remix-run/node";
import { useState, useEffect } from "react";
import { useUserRole } from "~/hooks/useUserRole";
import { AccessDenied } from "~/components/AccessDenied";
import { cn } from "~/lib/utils";
import { UsersTabContent } from "~/components/admin/UsersTabContent";
// Import the new Master tab components
import { GroupsManagement } from "~/components/admin/GroupsManagement";
import { EssenceSettings } from "~/components/admin/EssenceSettings";
import { BackupRestore } from "~/components/admin/BackupRestore";


export const meta: MetaFunction = () => {
  return [
    { title: "Life Economy - Admin" },
    { name: "description", content: "Admin section for Life Economy" },
  ];
};

// --- Icons for Tabs ---
function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) { // Using Settings icon for "Master"
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 .54 1.73v.5c0 .83-.44 1.56-1.17 1.95l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1.17-1.95v-.5c0-.83.44-1.56 1.17-1.95l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// --- Tab Content Components ---

// Updated MasterTabContent to include the new subsections
function MasterTabContent() {
  return (
    <div className="p-4 border rounded-b-md dark:border-gray-700 bg-gray-50 dark:bg-gray-950 space-y-6">
       {/* Wrap each section in a container if needed for styling */}
       <GroupsManagement />
       <EssenceSettings />
       <BackupRestore />
    </div>
  );
}

// --- Main Admin Component ---
type AdminTab = "users" | "master";

export default function Admin() {
  const userRole = useUserRole();
  const [activeTab, setActiveTab] = useState<AdminTab>("users");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set client flag after mount to avoid hydration issues with role check
  }, []);

  // Render Access Denied if not Super Admin or still hydrating
  if (!isClient || userRole !== 'Super Admin') {
    // Show loading or null during hydration check if preferred
    if (!isClient) return null;
    return <AccessDenied requiredRole="Super Admin" />;
  }

  // Render Admin content if Super Admin
  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <UsersTabContent />;
      case "master":
        return <MasterTabContent />; // Render the updated Master tab content
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Admin Console</h1>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("users")}
          className={cn(
            "flex items-center gap-2 px-4 py-3 -mb-px border-b-2 text-sm font-medium focus:outline-none",
            activeTab === "users"
              ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
          )}
        >
          <UsersIcon className="h-5 w-5" />
          Users
        </button>
        <button
          onClick={() => setActiveTab("master")}
          className={cn(
            "flex items-center gap-2 px-4 py-3 -mb-px border-b-2 text-sm font-medium focus:outline-none",
            activeTab === "master"
              ? "border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
          )}
        >
          <SettingsIcon className="h-5 w-5" />
          Master
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="mt-0"> {/* Remove top margin to connect content to tabs */}
        {renderContent()}
      </div>
    </div>
  );
}
