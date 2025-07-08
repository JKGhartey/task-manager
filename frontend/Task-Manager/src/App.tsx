import "./App.css";

import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

// Admin Pages
import AdminDashboard from "./pages/Admin/Dashboard";
import CreateTask from "./pages/Admin/CreateTask";
import Layout from "./components/Layout";
// Auth Pages
import Login from "./pages/Auth/Login";
import ManageTasks from "./pages/Admin/ManageTasks";
import ManageUsers from "./pages/Admin/ManageUsers";
import MyTasks from "./pages/User/MyTasks";
// Components
import PrivateRoute from "./routes/PrivateRoute";
// Route constants
import { ROUTES } from "./routes/routes";
import Signup from "./pages/Auth/Signup";
// User Pages
import UserDashboard from "./pages/User/Dashboard";
import { useState } from "react";

function App() {
  // TODO: Replace with actual auth state management
  const [isAuthenticated] = useState(false);
  const [userRole] = useState<"admin" | "user" | null>(null);

  return (
    <Router>
      <Layout
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        onLogout={() => {
          // TODO: Implement logout functionality
          console.log("Logout clicked");
        }}
      >
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.SIGNUP} element={<Signup />} />

          {/* Redirect root to appropriate dashboard */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                userRole === "admin" ? (
                  <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />
                ) : (
                  <Navigate to={ROUTES.USER.DASHBOARD} replace />
                )
              ) : (
                <Navigate to={ROUTES.LOGIN} replace />
              )
            }
          />

          {/* Admin Routes */}
          <Route
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated && userRole === "admin"}
              />
            }
          >
            <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
            <Route path={ROUTES.ADMIN.CREATE_TASK} element={<CreateTask />} />
            <Route path={ROUTES.ADMIN.MANAGE_TASKS} element={<ManageTasks />} />
            <Route path={ROUTES.ADMIN.MANAGE_USERS} element={<ManageUsers />} />
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
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
