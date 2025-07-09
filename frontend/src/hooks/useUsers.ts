import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  userService,
  type User,
  type CreateUserData,
  type UpdateUserData,
  type UserFilters,
  type UserStats,
} from "@/utils/userService";

// Re-export types for convenience
export type { CreateUserData, UpdateUserData, UserFilters, UserStats, User };

export const useUsers = (initialFilters: UserFilters = {}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilters>(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUsers(filters);
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch users";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Create user
  const createUser = useCallback(
    async (userData: CreateUserData) => {
      try {
        const response = await userService.createUser(userData);
        toast.success("User created successfully");
        await fetchUsers(); // Refresh the list
        return response.data.user;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create user";
        toast.error(errorMessage);
        throw err;
      }
    },
    [fetchUsers]
  );

  // Update user
  const updateUser = useCallback(
    async (userId: string, userData: UpdateUserData) => {
      try {
        const response = await userService.updateUser(userId, userData);
        toast.success("User updated successfully");
        await fetchUsers(); // Refresh the list
        return response.data.user;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update user";
        toast.error(errorMessage);
        throw err;
      }
    },
    [fetchUsers]
  );

  // Update user status
  const updateUserStatus = useCallback(
    async (userId: string, status: string) => {
      try {
        const response = await userService.updateUserStatus(userId, status);
        toast.success("User status updated successfully");
        await fetchUsers(); // Refresh the list
        return response.data.user;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update user status";
        toast.error(errorMessage);
        throw err;
      }
    },
    [fetchUsers]
  );

  // Update user role
  const updateUserRole = useCallback(
    async (userId: string, role: string) => {
      try {
        const response = await userService.updateUserRole(userId, role);
        toast.success("User role updated successfully");
        await fetchUsers(); // Refresh the list
        return response.data.user;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update user role";
        toast.error(errorMessage);
        throw err;
      }
    },
    [fetchUsers]
  );

  // Delete user
  const deleteUser = useCallback(
    async (userId: string) => {
      try {
        await userService.deleteUser(userId);
        toast.success("User deleted successfully");
        await fetchUsers(); // Refresh the list
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete user";
        toast.error(errorMessage);
        throw err;
      }
    },
    [fetchUsers]
  );

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<UserFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 })); // Reset to first page when filters change
  }, []);

  // Change page
  const changePage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  // Search users
  const searchUsers = useCallback(
    async (query: string, searchFilters: Partial<UserFilters> = {}) => {
      try {
        setLoading(true);
        setError(null);
        const response = await userService.searchUsers(query, searchFilters);
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to search users";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Bulk update users
  const bulkUpdateUsers = useCallback(
    async (updates: Array<{ userId: string; updates: UpdateUserData }>) => {
      try {
        const response = await userService.bulkUpdateUsers(updates);
        toast.success(`Successfully updated ${response.updatedCount} users`);
        await fetchUsers(); // Refresh the list
        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to bulk update users";
        toast.error(errorMessage);
        throw err;
      }
    },
    [fetchUsers]
  );

  // Refresh users
  const refreshUsers = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    // State
    users,
    loading,
    error,
    filters,
    pagination,

    // Actions
    fetchUsers,
    createUser,
    updateUser,
    updateUserStatus,
    updateUserRole,
    deleteUser,
    searchUsers,
    bulkUpdateUsers,
    updateFilters,
    changePage,
    refreshUsers,
  };
};

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUserStats();
      setStats(response.data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch user statistics";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats,
  };
};

export const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getCurrentUser();
      setUser(response.data.user);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch current user";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCurrentUser = useCallback(async (userData: UpdateUserData) => {
    try {
      const response = await userService.updateCurrentUser(userData);
      setUser(response.data.user);
      toast.success("Profile updated successfully");
      return response.data.user;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update profile";
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return {
    user,
    loading,
    error,
    updateCurrentUser,
    refreshUser: fetchCurrentUser,
  };
};
