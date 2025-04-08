import { Link, NavLink } from "@remix-run/react"; // Use NavLink for active styling
import { cn } from "~/lib/utils"; // Import cn
import { useUserRole } from "~/hooks/useUserRole"; // Import the mock hook

export function Header() {
  const userRole = useUserRole(); // Get the simulated user role

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <DollarSignIcon className="h-6 w-6" />
          <span>Life Economy</span>
        </Link>
        <nav className="hidden items-center gap-4 text-sm font-medium md:flex">
          <NavLink
            to="/dashboard" // Assuming a dashboard route exists or will exist
            className={({ isActive }) =>
              cn(
                "hover:text-gray-900 dark:hover:text-gray-50",
                isActive
                  ? "text-gray-900 dark:text-gray-50"
                  : "text-gray-500 dark:text-gray-400"
              )
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              cn(
                "hover:text-gray-900 dark:hover:text-gray-50",
                isActive
                  ? "text-gray-900 dark:text-gray-50"
                  : "text-gray-500 dark:text-gray-400"
              )
            }
          >
            Transactions
          </NavLink>
          <NavLink
            to="/transfer"
            className={({ isActive }) =>
              cn(
                "hover:text-gray-900 dark:hover:text-gray-50",
                isActive
                  ? "text-gray-900 dark:text-gray-50"
                  : "text-gray-500 dark:text-gray-400"
              )
            }
          >
            Transfer
          </NavLink>
          {/* Conditionally render Admin link */}
          {userRole === 'Super Admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  "hover:text-gray-900 dark:hover:text-gray-50",
                  isActive
                    ? "text-gray-900 dark:text-gray-50"
                    : "text-gray-500 dark:text-gray-400"
                )
              }
            >
              Admin
            </NavLink>
          )}
          <NavLink
            to="/management"
            className={({ isActive }) =>
              cn(
                "hover:text-gray-900 dark:hover:text-gray-50",
                isActive
                  ? "text-gray-900 dark:text-gray-50"
                  : "text-gray-500 dark:text-gray-400"
              )
            }
          >
            Management
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                "hover:text-gray-900 dark:hover:text-gray-50",
                isActive
                  ? "text-gray-900 dark:text-gray-50"
                  : "text-gray-500 dark:text-gray-400"
              )
            }
          >
            Settings
          </NavLink>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        {/* Placeholder for User Dropdown */}
        <div className="flex items-center gap-2 rounded-md border p-2 text-sm">
          <span>Jane Doe</span>
          {/* Display the simulated role */}
          <span className="rounded-sm bg-gray-200 px-1 text-xs dark:bg-gray-700">
            {userRole || 'User'} {/* Show role, default to User if null */}
          </span>
          <LogOutIcon className="h-4 w-4" />
        </div>
      </div>
    </header>
  );
}

// --- Icons (Keep existing icons) ---

function DollarSignIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function LogOutIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}
