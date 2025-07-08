import { Navigate, Outlet } from "react-router-dom";

import { ROUTES } from "./routes";

interface PrivateRouteProps {
  isAuthenticated: boolean;
  redirectTo?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  isAuthenticated,
  redirectTo = ROUTES.LOGIN,
}) => {
  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default PrivateRoute;
