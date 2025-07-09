import api from "./axiosInstance";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin" | "manager";
  status: "active" | "inactive" | "suspended";
  department?: string;
  position?: string;
  phone?: string;
  isEmailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  hireDate?: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "user" | "admin" | "manager";
  status: "active" | "inactive" | "suspended";
  department?: string;
  position?: string;
  phone?: string;
  dateOfBirth?: string;
  hireDate?: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: "user" | "admin" | "manager";
  status?: "active" | "inactive" | "suspended";
  department?: string;
  position?: string;
  phone?: string;
  dateOfBirth?: string;
  hireDate?: string;
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  department?: string;
  page?: number;
  limit?: number;
}

export interface UserStats {
  totalUsers: number;
  statusBreakdown: {
    active: number;
    inactive: number;
    suspended: number;
  };
  roleBreakdown: {
    admin: number;
    manager: number;
    user: number;
  };
  verificationBreakdown: {
    verified: number;
    unverified: number;
  };
  departmentStats: Array<{ _id: string; count: number }>;
  recentRegistrations: number;
}

export interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface UserResponse {
  success: boolean;
  data: {
    user: User;
  };
}

export interface UserStatsResponse {
  success: boolean;
  data: UserStats;
}

export const userService = {
  // Get all users with filtering and pagination (Admin only)
  async getUsers(filters: UserFilters = {}): Promise<UsersResponse> {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.role) params.append("role", filters.role);
    if (filters.status) params.append("status", filters.status);
    if (filters.department) params.append("department", filters.department);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    const response = await api.get(`/users?${params.toString()}`);
    return response.data;
  },

  // Create a new user (Admin only)
  async createUser(userData: CreateUserData): Promise<UserResponse> {
    const response = await api.post("/users", userData);
    return response.data;
  },

  // Get user statistics (Admin only)
  async getUserStats(): Promise<UserStatsResponse> {
    const response = await api.get("/users/stats");
    return response.data;
  },

  // Search users (Admin only)
  async searchUsers(
    query: string,
    filters: Partial<UserFilters> = {}
  ): Promise<UsersResponse> {
    const params = new URLSearchParams();
    params.append("q", query);

    if (filters.role) params.append("role", filters.role);
    if (filters.status) params.append("status", filters.status);
    if (filters.department) params.append("department", filters.department);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    const response = await api.get(`/users/search?${params.toString()}`);
    return response.data;
  },

  // Get user by ID (Admin only)
  async getUserById(userId: string): Promise<UserResponse> {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Update a user (Admin only)
  async updateUser(
    userId: string,
    userData: UpdateUserData
  ): Promise<UserResponse> {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  // Delete a user (Admin only)
  async deleteUser(
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  // Update user status (Admin only)
  async updateUserStatus(
    userId: string,
    status: string
  ): Promise<UserResponse> {
    const response = await api.patch(`/users/${userId}/status`, { status });
    return response.data;
  },

  // Update user role (Admin only)
  async updateUserRole(userId: string, role: string): Promise<UserResponse> {
    const response = await api.patch(`/users/${userId}/role`, { role });
    return response.data;
  },

  // Bulk update users (Admin only)
  async bulkUpdateUsers(
    updates: Array<{ userId: string; updates: UpdateUserData }>
  ): Promise<{ success: boolean; message: string; updatedCount: number }> {
    const response = await api.patch("/users/bulk-update", { updates });
    return response.data;
  },

  // Get current user profile (non-admin endpoint)
  async getCurrentUser(): Promise<UserResponse> {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Update current user profile (non-admin endpoint)
  async updateCurrentUser(userData: UpdateUserData): Promise<UserResponse> {
    const response = await api.put("/auth/profile", userData);
    return response.data;
  },
};
