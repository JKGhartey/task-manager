# Task Manager Routing Structure

## Overview

This document describes the routing structure of the Task Manager application.

## Route Configuration

### Public Routes

- `/login` - User login page
- `/signup` - User registration page

### Admin Routes (Protected)

- `/admin/dashboard` - Admin dashboard
- `/admin/create-task` - Create new tasks
- `/admin/manage-tasks` - Manage all tasks
- `/admin/manage-users` - Manage users

### User Routes (Protected)

- `/user/dashboard` - User dashboard
- `/user/my-tasks` - View assigned tasks

## Route Protection

### PrivateRoute Component

The `PrivateRoute` component protects routes that require authentication:

- Checks if user is authenticated
- Redirects to login if not authenticated
- Supports role-based access control

### Authentication Flow

1. Unauthenticated users are redirected to `/login`
2. After successful login, users are redirected to their appropriate dashboard:
   - Admins → `/admin/dashboard`
   - Users → `/user/dashboard`

## Navigation

### Dynamic Navigation

The navigation adapts based on authentication status and user role:

- **Unauthenticated**: Shows Login and Signup links
- **Admin**: Shows admin-specific navigation links
- **User**: Shows user-specific navigation links

### Active Route Highlighting

The current route is highlighted in the navigation bar with blue styling.

## File Structure

```
src/
├── routes/
│   ├── PrivateRoute.tsx    # Route protection component
│   └── routes.ts          # Route configuration constants
├── components/
│   ├── Layout.tsx         # Main layout wrapper
│   └── Navigation.tsx     # Dynamic navigation component
└── pages/
    ├── Auth/
    │   ├── Login.tsx
    │   └── Signup.tsx
    ├── Admin/
    │   ├── Dashboard.tsx
    │   ├── CreateTask.tsx
    │   ├── ManageTasks.tsx
    │   └── ManageUsers.tsx
    └── User/
        ├── Dashboard.tsx
        └── MyTasks.tsx
```

## Usage

### Adding New Routes

1. Create the page component in the appropriate directory
2. Add the route path to `src/routes/routes.ts`
3. Add the route to `App.tsx` with appropriate protection
4. Update navigation if needed

### Route Constants

Use the `ROUTES` constant from `routes.ts` for consistent route paths:

```typescript
import { ROUTES } from "../routes/routes";

// Instead of hardcoding '/admin/dashboard'
<Link to={ROUTES.ADMIN.DASHBOARD}>Dashboard</Link>;
```

## Future Enhancements

- Add route-based code splitting
- Implement breadcrumb navigation
- Add route transition animations
- Support for nested routes
