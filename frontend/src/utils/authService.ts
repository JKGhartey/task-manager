import type {
  AuthResponse,
  ChangePasswordData,
  ForgotPasswordData,
  LoginData,
  ResetPasswordData,
  SignupData,
  UpdateProfileData,
} from "@/types/auth";

import api from "./axiosInstance";

export const authService = {
  // Register a new user
  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  // Login user
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  // Logout user
  async logout(): Promise<{ success: boolean; message: string }> {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  // Get current user profile
  async getMe(): Promise<{
    success: boolean;
    data: { user: AuthResponse["data"]["user"] };
  }> {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Update user profile
  async updateProfile(data: UpdateProfileData): Promise<{
    success: boolean;
    message: string;
    data: { user: AuthResponse["data"]["user"] };
  }> {
    const response = await api.put("/auth/profile", data);
    return response.data;
  },

  // Change password
  async changePassword(data: ChangePasswordData): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.put("/auth/change-password", data);
    return response.data;
  },

  // Forgot password
  async forgotPassword(data: ForgotPasswordData): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.post("/auth/forgot-password", data);
    return response.data;
  },

  // Reset password
  async resetPassword(data: ResetPasswordData): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  },

  // Store token in localStorage
  setToken(token: string): void {
    localStorage.setItem("token", token);
  },

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem("token");
  },

  // Remove token from localStorage
  removeToken(): void {
    localStorage.removeItem("token");
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Verify email with token
  async verifyEmail(token: string): Promise<{
    success: boolean;
    message: string;
    data?: {
      user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: string;
        status: string;
        isEmailVerified: boolean;
      };
    };
  }> {
    const response = await api.post("/auth/verify-email", { token });
    return response.data;
  },

  // Resend email verification
  async resendVerification(): Promise<{ success: boolean; message: string }> {
    const response = await api.post("/auth/resend-verification");
    return response.data;
  },
};
