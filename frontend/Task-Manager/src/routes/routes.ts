// Route paths configuration
export const ROUTES = {
  // Public routes
  LOGIN: "/login",
  SIGNUP: "/signup",

  // Admin routes
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    CREATE_TASK: "/admin/create-task",
    MANAGE_TASKS: "/admin/manage-tasks",
    MANAGE_USERS: "/admin/manage-users",
  },

  // User routes
  USER: {
    DASHBOARD: "/user/dashboard",
    MY_TASKS: "/user/my-tasks",
  },
} as const;

// Route configuration for navigation
export const NAVIGATION_ROUTES = {
  public: [
    { path: ROUTES.LOGIN, label: "Login" },
    { path: ROUTES.SIGNUP, label: "Signup" },
  ],
  admin: [
    { path: ROUTES.ADMIN.DASHBOARD, label: "Dashboard" },
    { path: ROUTES.ADMIN.CREATE_TASK, label: "Create Task" },
    { path: ROUTES.ADMIN.MANAGE_TASKS, label: "Manage Tasks" },
    { path: ROUTES.ADMIN.MANAGE_USERS, label: "Manage Users" },
  ],
  user: [
    { path: ROUTES.USER.DASHBOARD, label: "Dashboard" },
    { path: ROUTES.USER.MY_TASKS, label: "My Tasks" },
  ],
} as const;
