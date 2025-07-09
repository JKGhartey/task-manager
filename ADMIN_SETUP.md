# Admin Account Setup Guide

This guide explains how to create admin accounts for the Task Manager system.

## Method 1: Using the Backend Script (Recommended for Initial Setup)

### Prerequisites

- Node.js and npm installed
- MongoDB running
- Backend dependencies installed

### Steps

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies (if not already done):**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend directory with:

   ```env
   MONGODB_URI=mongodb://localhost:27017/task-manager
   JWT_SECRET=your-secret-key
   ```

4. **Run the admin creation script:**

   ```bash
   npm run create-admin
   ```

   This will create a default admin account with:

   - **Email:** admin@taskmanager.com
   - **Password:** Admin123!
   - **Role:** Admin
   - **Status:** Active

5. **Login with the admin credentials:**
   - Go to the login page
   - Use the email and password from step 4
   - You'll be redirected to the admin dashboard

### Customizing the Admin Account

To create an admin with custom credentials, you can modify the `adminData` object in `backend/scripts/createAdmin.js`:

```javascript
const adminData = {
  firstName: "Your",
  lastName: "Name",
  email: "your-email@example.com",
  password: "YourSecurePassword123!",
  department: "IT",
  position: "System Administrator",
};
```

## Method 2: Using the Admin Interface (For Additional Admins)

Once you have an initial admin account, you can create additional admin accounts through the web interface:

1. **Login as an existing admin**
2. **Navigate to Admin Dashboard → Manage Users**
3. **Click "Create User"**
4. **Fill in the user details:**
   - Set Role to "Admin"
   - Set Status to "Active"
   - Fill in other required fields
5. **Click "Create User"**

## Method 3: Direct Database Creation (Advanced)

For advanced users, you can create an admin account directly in MongoDB:

```javascript
// Connect to MongoDB and run this in the MongoDB shell
use task-manager

db.users.insertOne({
  firstName: "Admin",
  lastName: "User",
  email: "admin@example.com",
  password: "$2b$12$...", // bcrypt hashed password
  role: "admin",
  status: "active",
  isEmailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Admin Features

Once logged in as an admin, you have access to:

### Dashboard Features

- **System Overview:** View system-wide statistics
- **User Management:** Create, edit, and manage users
- **Task Management:** Create and manage tasks for all users
- **System Analytics:** View performance metrics and user activity

### User Management Capabilities

- Create new users with any role (User, Manager, Admin)
- Edit user profiles and information
- Change user roles and status
- View user activity and statistics
- Manage user permissions

### Security Features

- Role-based access control
- User status management (Active, Inactive, Suspended)
- Email verification system
- Password reset functionality
- Login attempt tracking

## Security Best Practices

1. **Change Default Password:** Always change the default admin password after first login
2. **Use Strong Passwords:** Use passwords with at least 8 characters, including uppercase, lowercase, numbers, and symbols
3. **Limit Admin Access:** Only grant admin access to trusted users
4. **Regular Audits:** Regularly review admin accounts and their activities
5. **Secure Environment:** Ensure your production environment uses HTTPS and secure database connections

## Troubleshooting

### Common Issues

1. **"Admin user already exists"**

   - The script detected an existing admin with the same email
   - Use a different email or delete the existing user first

2. **"MongoDB connection failed"**

   - Ensure MongoDB is running
   - Check your MONGODB_URI in the .env file
   - Verify network connectivity

3. **"Invalid credentials" during login**
   - Double-check the email and password
   - Ensure the user status is "active"
   - Check if the account is locked due to failed login attempts

### Getting Help

If you encounter issues:

1. Check the console output for error messages
2. Verify your environment variables
3. Ensure all dependencies are installed
4. Check the MongoDB connection
5. Review the application logs

## API Endpoints for Admin Operations

The following API endpoints are available for admin operations:

- `POST /api/users` - Create new user
- `GET /api/users` - Get all users
- `PUT /api/users/:id` - Update user
- `PATCH /api/users/:id/status` - Update user status
- `PATCH /api/users/:id/role` - Update user role
- `GET /api/users/stats` - Get user statistics

All admin endpoints require authentication with a valid admin token.
