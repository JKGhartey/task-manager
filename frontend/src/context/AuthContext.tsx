import React, {
  type ReactNode,
  createContext,
  useEffect,
  useState,
} from "react";

import { authService } from "@/utils/authService";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  isEmailVerified: boolean;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  userRole: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          // Try to get user data from localStorage first for faster loading
          const userData = localStorage.getItem("user");
          if (userData) {
            try {
              const parsedUser = JSON.parse(userData);
              setUser(parsedUser);
              setIsAuthenticated(true);

              // Optionally validate token with backend (uncomment if needed)
              // try {
              //   const response = await authService.getMe();
              //   if (response.success) {
              //     setUser(response.data.user);
              //     localStorage.setItem("user", JSON.stringify(response.data.user));
              //   } else {
              //     throw new Error("Token validation failed");
              //   }
              // } catch (error) {
              //   console.error("Token validation failed:", error);
              //   authService.removeToken();
              //   localStorage.removeItem("user");
              //   setUser(null);
              //   setIsAuthenticated(false);
              // }
            } catch (error) {
              console.error("Error parsing user data:", error);
              authService.removeToken();
              localStorage.removeItem("user");
            }
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setIsAuthenticated(true);
    authService.setToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    authService.removeToken();
    localStorage.removeItem("user");
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    userRole: user?.role || null,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
