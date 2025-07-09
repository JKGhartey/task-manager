// Route paths configuration
export const ROUTES = {
  // Public routes
  LANDING: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  CHANGE_PASSWORD: "/change-password",
  VERIFY_EMAIL: "/verify-email",

  // Admin routes
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    CREATE_TASK: "/admin/create-task",
    MANAGE_TASKS: "/admin/manage-tasks",
    MANAGE_USERS: "/admin/manage-users",
    MANAGE_DEPARTMENTS: "/admin/manage-departments",
    EDIT_TASK: "/admin/edit-task/:id",
    SYSTEM_HEALTH: "/admin/system-health",
    SYSTEM_ANALYTICS: "/admin/system-analytics",
  },

  // User routes
  USER: {
    DASHBOARD: "/user/dashboard",
    MY_TASKS: "/user/my-tasks",
    VIEW_TASK_DETAILS: "/tasks/:id",
    VIEW_DEPARTMENTS: "/user/departments",
  },
} as const;

// Route configuration for navigation
export const NAVIGATION_ROUTES = {
  public: [
    { path: ROUTES.LANDING, label: "Home" },
    { path: ROUTES.LOGIN, label: "Login" },
    { path: ROUTES.SIGNUP, label: "Signup" },
    { path: ROUTES.FORGOT_PASSWORD, label: "Forgot Password" },
    { path: ROUTES.VERIFY_EMAIL, label: "Verify Email" },
  ],
  admin: [
    { path: ROUTES.ADMIN.DASHBOARD, label: "Dashboard" },
    { path: ROUTES.ADMIN.CREATE_TASK, label: "Create Task" },
    { path: ROUTES.ADMIN.MANAGE_TASKS, label: "Manage Tasks" },
    { path: ROUTES.ADMIN.MANAGE_USERS, label: "Manage Users" },
    { path: ROUTES.ADMIN.MANAGE_DEPARTMENTS, label: "Manage Departments" },
    { path: ROUTES.ADMIN.SYSTEM_HEALTH, label: "System Health" },
    { path: ROUTES.ADMIN.SYSTEM_ANALYTICS, label: "System Analytics" },
  ],
  user: [
    { path: ROUTES.USER.DASHBOARD, label: "Dashboard" },
    { path: ROUTES.USER.MY_TASKS, label: "My Tasks" },
    { path: ROUTES.USER.VIEW_TASK_DETAILS, label: "View Task Details" },
    { path: ROUTES.USER.VIEW_DEPARTMENTS, label: "Departments" },
  ],
} as const;
