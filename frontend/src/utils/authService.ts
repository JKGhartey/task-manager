import type { AuthResponse, LoginData, SignupData } from "@/types/auth";

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
  async verifyEmail(
    token: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post("/auth/verify-email", { token });
    return response.data;
  },

  // Resend email verification
  async resendVerification(): Promise<{ success: boolean; message: string }> {
    const response = await api.post("/auth/resend-verification");
    return response.data;
  },
};
