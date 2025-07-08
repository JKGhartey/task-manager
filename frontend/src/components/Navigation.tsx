import { Link, useLocation } from "react-router-dom";

import { ROUTES } from "../routes/routes";

interface NavigationProps {
  isAuthenticated: boolean;
  userRole: "admin" | "user" | null;
  onLogout?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  isAuthenticated,
  userRole,
  onLogout,
}) => {
  const location = useLocation();

  const getActiveClass = (path: string) => {
    return location.pathname === path
      ? "bg-blue-100 text-blue-700"
      : "text-gray-700 hover:text-gray-900";
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Task Manager
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              // Public navigation
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${getActiveClass(
                    ROUTES.LOGIN
                  )}`}
                >
                  Login
                </Link>
                <Link
                  to={ROUTES.SIGNUP}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${getActiveClass(
                    ROUTES.SIGNUP
                  )}`}
                >
                  Signup
                </Link>
              </>
            ) : (
              // Authenticated user navigation
              <>
                {userRole === "admin" && (
                  <>
                    <Link
                      to={ROUTES.ADMIN.DASHBOARD}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${getActiveClass(
                        ROUTES.ADMIN.DASHBOARD
                      )}`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to={ROUTES.ADMIN.CREATE_TASK}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${getActiveClass(
                        ROUTES.ADMIN.CREATE_TASK
                      )}`}
                    >
                      Create Task
                    </Link>
                    <Link
                      to={ROUTES.ADMIN.MANAGE_TASKS}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${getActiveClass(
                        ROUTES.ADMIN.MANAGE_TASKS
                      )}`}
                    >
                      Manage Tasks
                    </Link>
                    <Link
                      to={ROUTES.ADMIN.MANAGE_USERS}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${getActiveClass(
                        ROUTES.ADMIN.MANAGE_USERS
                      )}`}
                    >
                      Manage Users
                    </Link>
                  </>
                )}

                {userRole === "user" && (
                  <>
                    <Link
                      to={ROUTES.USER.DASHBOARD}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${getActiveClass(
                        ROUTES.USER.DASHBOARD
                      )}`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to={ROUTES.USER.MY_TASKS}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${getActiveClass(
                        ROUTES.USER.MY_TASKS
                      )}`}
                    >
                      My Tasks
                    </Link>
                  </>
                )}

                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Logout
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
