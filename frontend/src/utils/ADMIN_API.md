# Admin API Endpoints Documentation

This document outlines all the admin API endpoints available in the task manager application and how they are implemented in the frontend.

## Important Note

The axios instance is configured with `baseURL: "http://localhost:3001/api"`, so all service methods use relative paths. For example:

- `api.get('/users')` → `http://localhost:3001/api/users`
- `api.get('/users/stats')` → `http://localhost:3001/api/users/stats`

## User Management Endpoints

### 1. **GET** `/api/users`

**Get all users with filtering and pagination (Admin only)**

**Frontend Implementation:**

```typescript
// In userService.ts
async getUsers(filters: UserFilters = {}): Promise<UsersResponse>

// In useUsers hook
const { users, loading, error, filters, pagination } = useUsers();
```

**Query Parameters:**

- `search` - Search by name or email
- `role` - Filter by role (user, admin, manager)
- `status` - Filter by status (active, inactive, suspended)
- `department` - Filter by department
- `page` - Page number for pagination
- `limit` - Number of items per page

**Usage Example:**

```typescript
const { users, updateFilters } = useUsers({
  role: "user",
  status: "active",
  page: 1,
  limit: 10,
});

// Update filters
updateFilters({ search: "john" });
```

### 2. **POST** `/api/users`

**Create a new user (Admin only)**

**Frontend Implementation:**

```typescript
// In userService.ts
async createUser(userData: CreateUserData): Promise<UserResponse>

// In useUsers hook
const { createUser } = useUsers();
```

**Request Body:**

```typescript
interface CreateUserData {
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
```

**Usage Example:**

```typescript
const handleCreateUser = async (userData: CreateUserData) => {
  try {
    await createUser(userData);
    // Success toast is handled automatically
  } catch (error) {
    // Error is handled automatically
    console.error("Failed to create user:", error);
  }
};
```

### 3. **GET** `/api/users/stats`

**Get user statistics (Admin only)**

**Frontend Implementation:**

```typescript
// In userService.ts
async getUserStats(): Promise<UserStatsResponse>

// In useUserStats hook
const { stats, loading, error } = useUserStats();
```

**Response:**

```typescript
interface UserStats {
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
```

### 4. **GET** `/api/users/search`

**Search users (Admin only)**

**Frontend Implementation:**

```typescript
// In userService.ts
async searchUsers(query: string, filters: Partial<UserFilters> = {}): Promise<UsersResponse>

// In useUsers hook
const { searchUsers } = useUsers();
```

**Query Parameters:**

- `q` - Search query (required)
- `role` - Filter by role
- `status` - Filter by status
- `department` - Filter by department
- `page` - Page number
- `limit` - Items per page

**Usage Example:**

```typescript
const handleSearch = async (query: string) => {
  await searchUsers(query, { role: "user", status: "active" });
};
```

### 5. **GET** `/api/users/{id}`

**Get user by ID (Admin only)**

**Frontend Implementation:**

```typescript
// In userService.ts
async getUserById(userId: string): Promise<UserResponse>
```

**Usage Example:**

```typescript
const fetchUserDetails = async (userId: string) => {
  try {
    const response = await userService.getUserById(userId);
    return response.data.user;
  } catch (error) {
    toast.error("Failed to fetch user details");
  }
};
```

### 6. **PUT** `/api/users/{id}`

**Update a user (Admin only)**

**Frontend Implementation:**

```typescript
// In userService.ts
async updateUser(userId: string, userData: UpdateUserData): Promise<UserResponse>

// In useUsers hook
const { updateUser } = useUsers();
```

**Request Body:**

```typescript
interface UpdateUserData {
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
```

### 7. **DELETE** `/api/users/{id}`

**Delete a user (Admin only)**

**Frontend Implementation:**

```typescript
// In userService.ts
async deleteUser(userId: string): Promise<{ success: boolean; message: string }>

// In useUsers hook
const { deleteUser } = useUsers();
```

**Usage Example:**

```typescript
const handleDeleteUser = async (userId: string) => {
  try {
    await deleteUser(userId);
    // Success toast is handled automatically
  } catch (error) {
    // Error is handled automatically
    console.error("Failed to delete user:", error);
  }
};
```

### 8. **PATCH** `/api/users/{id}/status`

**Update user status (Admin only)**

**Frontend Implementation:**

```typescript
// In userService.ts
async updateUserStatus(userId: string, status: string): Promise<UserResponse>

// In useUsers hook
const { updateUserStatus } = useUsers();
```

**Request Body:**

```json
{
  "status": "active" | "inactive" | "suspended"
}
```

**Usage Example:**

```typescript
const handleStatusChange = async (userId: string, status: string) => {
  try {
    await updateUserStatus(userId, status);
    // Success toast is handled automatically
  } catch (error) {
    // Error is handled automatically
    console.error("Failed to update user status:", error);
  }
};
```

### 9. **PATCH** `/api/users/{id}/role`

**Update user role (Admin only)**

**Frontend Implementation:**

```typescript
// In userService.ts
async updateUserRole(userId: string, role: string): Promise<UserResponse>

// In useUsers hook
const { updateUserRole } = useUsers();
```

**Request Body:**

```json
{
  "role": "user" | "admin" | "manager"
}
```

**Usage Example:**

```typescript
const handleRoleChange = async (userId: string, role: string) => {
  try {
    await updateUserRole(userId, role);
    // Success toast is handled automatically
  } catch (error) {
    // Error is handled automatically
    console.error("Failed to update user role:", error);
  }
};
```

### 10. **PATCH** `/api/users/bulk-update`

**Bulk update users (Admin only)**

**Frontend Implementation:**

```typescript
// In userService.ts
async bulkUpdateUsers(updates: Array<{ userId: string; updates: UpdateUserData }>): Promise<{ success: boolean; message: string; updatedCount: number }>

// In useUsers hook
const { bulkUpdateUsers } = useUsers();
```

**Request Body:**

```json
{
  "updates": [
    {
      "userId": "user_id_1",
      "updates": {
        "status": "active",
        "role": "manager"
      }
    },
    {
      "userId": "user_id_2",
      "updates": {
        "department": "Engineering"
      }
    }
  ]
}
```

**Usage Example:**

```typescript
const handleBulkUpdate = async (
  selectedUsers: string[],
  updates: UpdateUserData
) => {
  try {
    const bulkUpdates = selectedUsers.map((userId) => ({
      userId,
      updates,
    }));

    await bulkUpdateUsers(bulkUpdates);
    // Success toast is handled automatically
  } catch (error) {
    // Error is handled automatically
    console.error("Failed to bulk update users:", error);
  }
};
```

## Error Handling

All admin API calls include comprehensive error handling:

1. **Automatic Toast Notifications** - Success and error messages are displayed automatically
2. **Loading States** - Components show loading indicators during API calls
3. **Error Boundaries** - Prevents app crashes from API errors
4. **Retry Logic** - Automatic retry for failed requests where appropriate

## Authentication

All admin endpoints require:

- Valid JWT token in Authorization header
- Admin role permissions
- Token is automatically included via axios interceptors

## Type Safety

All endpoints are fully typed with TypeScript:

- Request/response interfaces
- Error handling types
- Pagination types
- Filter types

## Usage in Components

### Basic Usage:

```typescript
import { useUsers } from "@/hooks/useUsers";

export function UserManagement() {
  const { users, loading, error, createUser, updateUserStatus, deleteUser } =
    useUsers();

  // Component logic here
}
```

### Advanced Usage with Filters:

```typescript
const { users, filters, pagination, updateFilters, changePage, searchUsers } =
  useUsers({
    role: "user",
    status: "active",
    page: 1,
    limit: 20,
  });
```

This modular approach ensures that all admin functionality is properly abstracted, type-safe, and easily maintainable.
