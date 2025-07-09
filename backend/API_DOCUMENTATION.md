# Task Manager API Documentation

## Overview

The Task Manager API is a comprehensive REST API for managing tasks, users, and reports. It includes authentication, role-based access control, and extensive filtering capabilities.

## Quick Start

### Base URL

- **Development**: `http://localhost:3001`
- **Production**: `https://api.taskmanager.com` (when deployed)

### API Documentation

Access the interactive Swagger documentation at: `http://localhost:3001/api-docs`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Most endpoints require authentication.

### Getting a Token

1. **Register a new user**:

   ```bash
   POST /api/auth/register
   Content-Type: application/json

   {
     "firstName": "John",
     "lastName": "Doe",
     "email": "john@example.com",
     "password": "password123"
   }
   ```

2. **Login**:

   ```bash
   POST /api/auth/login
   Content-Type: application/json

   {
     "email": "john@example.com",
     "password": "password123"
   }
   ```

3. **Use the token**:
   ```bash
   Authorization: Bearer <your-jwt-token>
   ```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint                        | Description               | Auth Required |
| ------ | ------------------------------- | ------------------------- | ------------- |
| POST   | `/api/auth/register`            | Register a new user       | No            |
| POST   | `/api/auth/login`               | Login user                | No            |
| GET    | `/api/auth/me`                  | Get current user profile  | Yes           |
| PUT    | `/api/auth/profile`             | Update user profile       | Yes           |
| POST   | `/api/auth/change-password`     | Change password           | Yes           |
| POST   | `/api/auth/forgot-password`     | Request password reset    | No            |
| POST   | `/api/auth/reset-password`      | Reset password            | No            |
| POST   | `/api/auth/verify-email`        | Verify email address      | No            |
| POST   | `/api/auth/resend-verification` | Resend verification email | Yes           |

### Task Endpoints

| Method | Endpoint                                | Description                        | Auth Required |
| ------ | --------------------------------------- | ---------------------------------- | ------------- |
| GET    | `/api/tasks`                            | Get all tasks (with filtering)     | Yes           |
| POST   | `/api/tasks`                            | Create a new task                  | Yes           |
| GET    | `/api/tasks/:id`                        | Get task by ID                     | Yes           |
| PUT    | `/api/tasks/:id`                        | Update a task                      | Yes           |
| DELETE | `/api/tasks/:id`                        | Delete a task                      | Yes           |
| PATCH  | `/api/tasks/:id/status`                 | Update task status                 | Yes           |
| GET    | `/api/tasks/my-tasks`                   | Get tasks assigned to current user | Yes           |
| GET    | `/api/tasks/created-by-me`              | Get tasks created by current user  | Yes           |
| GET    | `/api/tasks/stats`                      | Get task statistics                | Yes           |
| POST   | `/api/tasks/:id/comments`               | Add comment to task                | Yes           |
| POST   | `/api/tasks/:id/subtasks`               | Add subtask to task                | Yes           |
| PATCH  | `/api/tasks/:id/subtasks/:subtaskIndex` | Complete subtask                   | Yes           |

### User Endpoints (Admin Only)

| Method | Endpoint                | Description         | Auth Required |
| ------ | ----------------------- | ------------------- | ------------- |
| GET    | `/api/users`            | Get all users       | Yes (Admin)   |
| POST   | `/api/users`            | Create a new user   | Yes (Admin)   |
| GET    | `/api/users/:id`        | Get user by ID      | Yes (Admin)   |
| PUT    | `/api/users/:id`        | Update a user       | Yes (Admin)   |
| DELETE | `/api/users/:id`        | Delete a user       | Yes (Admin)   |
| PATCH  | `/api/users/:id/status` | Update user status  | Yes (Admin)   |
| PATCH  | `/api/users/:id/role`   | Update user role    | Yes (Admin)   |
| GET    | `/api/users/stats`      | Get user statistics | Yes (Admin)   |

### Department Endpoints

| Method | Endpoint                  | Description            | Auth Required |
| ------ | ------------------------- | ---------------------- | ------------- |
| GET    | `/api/departments`        | Get all departments    | Yes (Admin)   |
| GET    | `/api/departments/stats`  | Get department stats   | Yes (Admin)   |
| GET    | `/api/departments/active` | Get active departments | Yes (Admin)   |
| GET    | `/api/departments/:id`    | Get department by ID   | Yes (Admin)   |
| POST   | `/api/departments`        | Create new department  | Yes (Admin)   |
| PUT    | `/api/departments/:id`    | Update department      | Yes (Admin)   |
| DELETE | `/api/departments/:id`    | Delete department      | Yes (Admin)   |

### Report Endpoints

| Method | Endpoint                         | Description            | Auth Required |
| ------ | -------------------------------- | ---------------------- | ------------- |
| GET    | `/api/reports/dashboard`         | Get dashboard overview | Yes           |
| GET    | `/api/reports/task-analytics`    | Get task analytics     | Yes           |
| GET    | `/api/reports/user-performance`  | Get user performance   | Yes           |
| GET    | `/api/reports/project-report`    | Get project report     | Yes           |
| GET    | `/api/reports/department-report` | Get department report  | Yes           |
| GET    | `/api/reports/export`            | Export report data     | Yes           |

## Data Models

### User Model

```json
{
  "_id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "role": "user|admin|manager",
  "status": "active|inactive|suspended",
  "avatar": "string",
  "phone": "string",
  "department": "string",
  "position": "string",
  "isEmailVerified": "boolean",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Department Model

```json
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "manager": {
    "_id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "avatar": "string"
  },
  "status": "active|inactive|archived",
  "code": "string",
  "location": "string",
  "budget": "number",
  "employeeCount": "number",
  "createdAt": "date",
  "updatedAt": "date"
}
```

### Task Model

```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "type": "feature|bug|improvement|documentation|maintenance",
  "priority": "low|medium|high|urgent",
  "status": "pending|in_progress|review|testing|done|cancelled",
  "assignee": "User",
  "createdBy": "User",
  "project": "string",
  "department": "string",
  "dueDate": "date",
  "startDate": "date",
  "completedDate": "date",
  "estimatedHours": "number",
  "actualHours": "number",
  "tags": ["string"],
  "progress": "number",
  "isPublic": "boolean",
  "comments": ["Comment"],
  "subtasks": ["Subtask"],
  "createdAt": "date",
  "updatedAt": "date"
}
```

## Query Parameters

### Pagination

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

### Task Filtering

- `search`: Search in title, description, or project
- `status`: Filter by task status
- `priority`: Filter by task priority
- `type`: Filter by task type
- `assignee`: Filter by assignee ID
- `createdBy`: Filter by creator ID
- `project`: Filter by project name
- `department`: Filter by department
- `isPublic`: Filter by public/private tasks

### User Filtering

- `search`: Search in first name, last name, or email
- `role`: Filter by user role
- `status`: Filter by user status
- `department`: Filter by department

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

### Paginated Response

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `423`: Locked (Account locked)
- `500`: Internal Server Error

## Rate Limiting

Currently, there are no rate limits implemented, but they may be added in production.

## Error Handling

The API provides detailed error messages for debugging:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Testing the API

### Using curl

1. **Register a user**:

   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "John",
       "lastName": "Doe",
       "email": "john@example.com",
       "password": "password123"
     }'
   ```

2. **Login**:

   ```bash
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "john@example.com",
       "password": "password123"
     }'
   ```

3. **Create a task** (using the token from login):
   ```bash
   curl -X POST http://localhost:3001/api/tasks \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -d '{
       "title": "Sample Task",
       "description": "This is a sample task",
       "assignee": "USER_ID_HERE",
       "priority": "medium",
       "type": "feature"
     }'
   ```

### Using Postman

1. Import the API documentation from Swagger
2. Set up environment variables for the base URL and token
3. Use the interactive documentation to test endpoints

## Frontend Integration

### Setting up axios

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Example API calls

```javascript
// Login
const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  localStorage.setItem("token", response.data.data.token);
  return response.data.data.user;
};

// Get tasks
const getTasks = async (params = {}) => {
  const response = await api.get("/tasks", { params });
  return response.data.data;
};

// Create task
const createTask = async (taskData) => {
  const response = await api.post("/tasks", taskData);
  return response.data.data.task;
};
```

## Environment Variables

Make sure to set up your `.env` file with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

## Support

For API support and questions:

- Email: support@taskmanager.com
- Documentation: http://localhost:3001/api-docs
- GitHub Issues: [Repository Issues Link]

## License

MIT License - see LICENSE file for details.
