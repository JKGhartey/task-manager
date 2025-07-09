import { Navigate, Route, Routes } from "react-router-dom";

// Admin Pages
import AdminDashboard from "../pages/Admin/Dashboard";
import ChangePassword from "../pages/Auth/ChangePassword";
import CreateTask from "../pages/Admin/CreateTask";
import EditTask from "../pages/Admin/EditTask";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Landing from "../pages/Landing";
// Auth Pages
import Login from "../pages/Auth/Login";
import ManageDepartments from "../pages/Admin/ManageDepartments";
import ManageProjects from "../pages/Admin/ManageProjects";
import ManageTasks from "../pages/Admin/ManageTasks";
import ManageTeams from "../pages/Admin/ManageTeams";
import ManageUsers from "../pages/Admin/ManageUsers";
import MyTasks from "../pages/User/MyTasks";
// Components
import PrivateRoute from "../routes/PrivateRoute";
// Route constants
import { ROUTES } from "../routes/routes";
import ResetPassword from "../pages/Auth/ResetPassword";
import Signup from "../pages/Auth/Signup";
import SystemAnalytics from "../pages/Admin/SystemAnalytics";
import SystemHealth from "../pages/Admin/SystemHealth";
// User Pages
import UserDashboard from "../pages/User/Dashboard";
import VerifyEmail from "../pages/Auth/VerifyEmail";
import ViewDepartments from "../pages/User/ViewDepartments";
import ViewTaskDetails from "../pages/User/ViewTaskDetails";
import { useAuth } from "../hooks/useAuth";

export function AppRoutes() {
  const { isAuthenticated, userRole, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path={ROUTES.LANDING} element={<Landing />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.SIGNUP} element={<Signup />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
      <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
      <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />

      {/* Redirect authenticated users to appropriate dashboard */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            userRole === "admin" || userRole === "manager" ? (
              <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />
            ) : (
              <Navigate to={ROUTES.USER.DASHBOARD} replace />
            )
          ) : (
            <Navigate to={ROUTES.LOGIN} replace />
          )
        }
      />

      {/* Shared Routes - All authenticated users */}
      <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
        <Route
          path={ROUTES.USER.VIEW_DEPARTMENTS}
          element={<ViewDepartments />}
        />
      </Route>

      {/* Admin Routes */}
      <Route
        element={
          <PrivateRoute
            isAuthenticated={
              isAuthenticated &&
              (userRole === "admin" || userRole === "manager")
            }
          />
        }
      >
        <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
        <Route path={ROUTES.ADMIN.CREATE_TASK} element={<CreateTask />} />
        <Route path={ROUTES.ADMIN.MANAGE_TASKS} element={<ManageTasks />} />
        <Route path={ROUTES.ADMIN.MANAGE_USERS} element={<ManageUsers />} />
        <Route
          path={ROUTES.ADMIN.MANAGE_DEPARTMENTS}
          element={<ManageDepartments />}
        />
        <Route path={ROUTES.ADMIN.MANAGE_TEAMS} element={<ManageTeams />} />
        <Route
          path={ROUTES.ADMIN.MANAGE_PROJECTS}
          element={<ManageProjects />}
        />
        <Route path={ROUTES.ADMIN.SYSTEM_HEALTH} element={<SystemHealth />} />
        <Route
          path={ROUTES.ADMIN.SYSTEM_ANALYTICS}
          element={<SystemAnalytics />}
        />
        <Route path="/admin/edit-task/:id" element={<EditTask />} />
      </Route>

      {/* User Routes */}
      <Route
        element={
          <PrivateRoute
            isAuthenticated={isAuthenticated && userRole === "user"}
          />
        }
      >
        <Route path={ROUTES.USER.DASHBOARD} element={<UserDashboard />} />
        <Route path={ROUTES.USER.MY_TASKS} element={<MyTasks />} />
        <Route
          path={ROUTES.USER.VIEW_TASK_DETAILS}
          element={<ViewTaskDetails />}
        />
        <Route path={ROUTES.CHANGE_PASSWORD} element={<ChangePassword />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
