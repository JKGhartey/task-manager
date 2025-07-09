# Service Layer Architecture

This directory contains the service layer that handles all API communication and business logic, making the codebase more modular and maintainable.

## Architecture Overview

The service layer follows a clean architecture pattern:

```
Components/Pages → Hooks → Services → API
```

### 1. Services (`/utils/`)

Services handle all API communication and provide a clean interface for data operations.

#### Available Services:

- **`userService.ts`** - User management operations
- **`taskService.ts`** - Task management operations
- **`authService.ts`** - Authentication operations
- **`axiosInstance.ts`** - Configured axios instance with interceptors

#### Service Pattern:

```typescript
export const userService = {
  async getUsers(filters: UserFilters): Promise<UsersResponse> {
    const response = await api.get(`/users?${params.toString()}`);
    return response.data;
  },

  async createUser(userData: CreateUserData): Promise<UserResponse> {
    const response = await api.post("/users", userData);
    return response.data;
  },
  // ... more methods
};
```

### 2. Hooks (`/hooks/`)

Custom hooks provide React components with state management and business logic.

#### Available Hooks:

- **`useUsers.ts`** - User management with state, filters, and pagination
- **`useUserStats.ts`** - User statistics
- **`useCurrentUser.ts`** - Current user profile management
- **`useAuth.ts`** - Authentication state management

#### Hook Pattern:

```typescript
export const useUsers = (initialFilters: UserFilters = {}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    // Implementation
  }, [filters]);

  const createUser = useCallback(
    async (userData: CreateUserData) => {
      // Implementation with error handling and toast notifications
    },
    [fetchUsers]
  );

  return {
    users,
    loading,
    error,
    createUser,
    // ... more methods
  };
};
```

## Benefits of This Architecture

### 1. **Separation of Concerns**

- Services handle API communication
- Hooks handle React state and side effects
- Components focus on UI rendering

### 2. **Reusability**

- Services can be used across different components
- Hooks encapsulate common patterns
- Business logic is centralized

### 3. **Maintainability**

- Easy to modify API endpoints in one place
- Consistent error handling and loading states
- Type safety throughout the application

### 4. **Testability**

- Services can be easily mocked for testing
- Hooks can be tested independently
- Clear interfaces make testing straightforward

## Usage Examples

### In a Component:

```typescript
import { useUsers } from "@/hooks/useUsers";

export function UserList() {
  const { users, loading, error, createUser, updateUserStatus } = useUsers();

  const handleCreateUser = async (userData) => {
    try {
      await createUser(userData);
      // Success is handled by the hook (toast notification)
    } catch (error) {
      // Error is already handled by the hook
      console.error("Failed to create user:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {users.map((user) => (
        <UserCard key={user._id} user={user} />
      ))}
    </div>
  );
}
```

### With Filters and Pagination:

```typescript
const {
  users,
  loading,
  filters,
  pagination,
  updateFilters,
  changePage,
  refreshUsers,
} = useUsers({
  search: "",
  role: "user",
  page: 1,
  limit: 10,
});

// Update filters
const handleSearch = (searchTerm: string) => {
  updateFilters({ search: searchTerm });
};

// Change page
const handlePageChange = (page: number) => {
  changePage(page);
};
```

## Error Handling

All hooks include comprehensive error handling:

- **Automatic toast notifications** for success/error states
- **Loading states** for better UX
- **Error boundaries** to prevent app crashes
- **Retry mechanisms** where appropriate

## Type Safety

All services and hooks are fully typed with TypeScript:

- **Interface definitions** for all data structures
- **Generic types** for flexible implementations
- **Strict typing** to prevent runtime errors

## Adding New Services

To add a new service:

1. **Create the service file** in `/utils/`
2. **Define interfaces** for request/response types
3. **Implement service methods** using the axios instance
4. **Create corresponding hooks** in `/hooks/`
5. **Export types** for use in components

Example:

```typescript
// utils/projectService.ts
export interface Project {
  id: string;
  name: string;
  // ... other properties
}

export const projectService = {
  async getProjects(): Promise<Project[]> {
    const response = await api.get("/projects");
    return response.data;
  },
};

// hooks/useProjects.ts
export const useProjects = () => {
  // Implementation
};
```

This architecture ensures that the codebase remains clean, maintainable, and scalable as it grows.
