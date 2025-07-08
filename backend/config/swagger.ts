import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description:
        "A comprehensive task management API with user authentication, task management, and reporting features.",
      contact: {
        name: "API Support",
        email: "support@taskmanager.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Development server",
      },
      {
        url: "https://api.taskmanager.com",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token in the format: Bearer <token>",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "User ID",
            },
            firstName: {
              type: "string",
              description: "User's first name",
            },
            lastName: {
              type: "string",
              description: "User's last name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            role: {
              type: "string",
              enum: ["user", "admin", "manager"],
              description: "User's role",
            },
            status: {
              type: "string",
              enum: ["active", "inactive", "suspended"],
              description: "User's account status",
            },
            avatar: {
              type: "string",
              description: "URL to user's avatar image",
            },
            phone: {
              type: "string",
              description: "User's phone number",
            },
            department: {
              type: "string",
              description: "User's department",
            },
            position: {
              type: "string",
              description: "User's job position",
            },
            isEmailVerified: {
              type: "boolean",
              description: "Whether user's email is verified",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Account creation date",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update date",
            },
          },
        },
        Task: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "Task ID",
            },
            title: {
              type: "string",
              description: "Task title",
            },
            description: {
              type: "string",
              description: "Task description",
            },
            type: {
              type: "string",
              enum: [
                "feature",
                "bug",
                "improvement",
                "documentation",
                "maintenance",
              ],
              description: "Task type",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high", "urgent"],
              description: "Task priority",
            },
            status: {
              type: "string",
              enum: [
                "pending",
                "in_progress",
                "review",
                "testing",
                "done",
                "cancelled",
              ],
              description: "Task status",
            },
            assignee: {
              $ref: "#/components/schemas/User",
              description: "User assigned to the task",
            },
            createdBy: {
              $ref: "#/components/schemas/User",
              description: "User who created the task",
            },
            project: {
              type: "string",
              description: "Project name",
            },
            department: {
              type: "string",
              description: "Department name",
            },
            dueDate: {
              type: "string",
              format: "date-time",
              description: "Task due date",
            },
            startDate: {
              type: "string",
              format: "date-time",
              description: "Task start date",
            },
            completedDate: {
              type: "string",
              format: "date-time",
              description: "Task completion date",
            },
            estimatedHours: {
              type: "number",
              description: "Estimated hours to complete",
            },
            actualHours: {
              type: "number",
              description: "Actual hours spent",
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Task tags",
            },
            progress: {
              type: "number",
              minimum: 0,
              maximum: 100,
              description: "Task progress percentage",
            },
            isPublic: {
              type: "boolean",
              description: "Whether task is public",
            },
            comments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  user: {
                    $ref: "#/components/schemas/User",
                  },
                  content: {
                    type: "string",
                  },
                  timestamp: {
                    type: "string",
                    format: "date-time",
                  },
                },
              },
              description: "Task comments",
            },
            subtasks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                  },
                  description: {
                    type: "string",
                  },
                  completed: {
                    type: "boolean",
                  },
                  completedBy: {
                    $ref: "#/components/schemas/User",
                  },
                  completedAt: {
                    type: "string",
                    format: "date-time",
                  },
                },
              },
              description: "Task subtasks",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Task creation date",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update date",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            password: {
              type: "string",
              description: "User's password",
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["firstName", "lastName", "email", "password"],
          properties: {
            firstName: {
              type: "string",
              description: "User's first name",
            },
            lastName: {
              type: "string",
              description: "User's last name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            password: {
              type: "string",
              minLength: 8,
              description: "User's password (minimum 8 characters)",
            },
            phone: {
              type: "string",
              description: "User's phone number",
            },
            department: {
              type: "string",
              description: "User's department",
            },
            position: {
              type: "string",
              description: "User's job position",
            },
            dateOfBirth: {
              type: "string",
              format: "date",
              description: "User's date of birth",
            },
          },
        },
        CreateTaskRequest: {
          type: "object",
          required: ["title", "description", "assignee"],
          properties: {
            title: {
              type: "string",
              description: "Task title",
            },
            description: {
              type: "string",
              description: "Task description",
            },
            type: {
              type: "string",
              enum: [
                "feature",
                "bug",
                "improvement",
                "documentation",
                "maintenance",
              ],
              description: "Task type",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high", "urgent"],
              description: "Task priority",
            },
            assignee: {
              type: "string",
              description: "User ID of the assignee",
            },
            project: {
              type: "string",
              description: "Project name",
            },
            department: {
              type: "string",
              description: "Department name",
            },
            dueDate: {
              type: "string",
              format: "date-time",
              description: "Task due date",
            },
            estimatedHours: {
              type: "number",
              description: "Estimated hours to complete",
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Task tags",
            },
            isPublic: {
              type: "boolean",
              description: "Whether task is public",
            },
          },
        },
        UpdateProfileRequest: {
          type: "object",
          properties: {
            firstName: {
              type: "string",
              description: "User's first name",
            },
            lastName: {
              type: "string",
              description: "User's last name",
            },
            phone: {
              type: "string",
              description: "User's phone number",
            },
            department: {
              type: "string",
              description: "User's department",
            },
            position: {
              type: "string",
              description: "User's job position",
            },
            dateOfBirth: {
              type: "string",
              format: "date",
              description: "User's date of birth",
            },
            avatar: {
              type: "string",
              description: "URL to user's avatar image",
            },
          },
        },
        ChangePasswordRequest: {
          type: "object",
          required: ["currentPassword", "newPassword"],
          properties: {
            currentPassword: {
              type: "string",
              description: "Current password",
            },
            newPassword: {
              type: "string",
              minLength: 8,
              description: "New password (minimum 8 characters)",
            },
          },
        },
        ForgotPasswordRequest: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
          },
        },
        ResetPasswordRequest: {
          type: "object",
          required: ["token", "newPassword"],
          properties: {
            token: {
              type: "string",
              description: "Password reset token",
            },
            newPassword: {
              type: "string",
              minLength: 8,
              description: "New password (minimum 8 characters)",
            },
          },
        },
        VerifyEmailRequest: {
          type: "object",
          required: ["token"],
          properties: {
            token: {
              type: "string",
              description: "Email verification token",
            },
          },
        },
        CreateUserRequest: {
          type: "object",
          required: ["firstName", "lastName", "email", "password"],
          properties: {
            firstName: {
              type: "string",
              description: "User's first name",
            },
            lastName: {
              type: "string",
              description: "User's last name",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
            },
            password: {
              type: "string",
              minLength: 8,
              description: "User's password (minimum 8 characters)",
            },
            role: {
              type: "string",
              enum: ["user", "admin", "manager"],
              description: "User's role",
            },
            status: {
              type: "string",
              enum: ["active", "inactive", "suspended"],
              description: "User's status",
            },
            phone: {
              type: "string",
              description: "User's phone number",
            },
            department: {
              type: "string",
              description: "User's department",
            },
            position: {
              type: "string",
              description: "User's job position",
            },
            dateOfBirth: {
              type: "string",
              format: "date",
              description: "User's date of birth",
            },
            hireDate: {
              type: "string",
              format: "date",
              description: "User's hire date",
            },
          },
        },
        UpdateUserStatusRequest: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: ["active", "inactive", "suspended"],
              description: "New user status",
            },
          },
        },
        UpdateUserRoleRequest: {
          type: "object",
          required: ["role"],
          properties: {
            role: {
              type: "string",
              enum: ["user", "admin", "manager"],
              description: "New user role",
            },
          },
        },
        BulkUpdateUsersRequest: {
          type: "object",
          required: ["userIds", "updates"],
          properties: {
            userIds: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of user IDs to update",
            },
            updates: {
              type: "object",
              properties: {
                status: {
                  type: "string",
                  enum: ["active", "inactive", "suspended"],
                },
                role: {
                  type: "string",
                  enum: ["user", "admin", "manager"],
                },
                department: {
                  type: "string",
                },
              },
              description: "Fields to update for all users",
            },
          },
        },
        UserStatsResponse: {
          type: "object",
          properties: {
            totalUsers: {
              type: "number",
              description: "Total number of users",
            },
            activeUsers: {
              type: "number",
              description: "Number of active users",
            },
            inactiveUsers: {
              type: "number",
              description: "Number of inactive users",
            },
            suspendedUsers: {
              type: "number",
              description: "Number of suspended users",
            },
            usersByRole: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  role: {
                    type: "string",
                  },
                  count: {
                    type: "number",
                  },
                },
              },
              description: "Users grouped by role",
            },
            usersByDepartment: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  department: {
                    type: "string",
                  },
                  count: {
                    type: "number",
                  },
                },
              },
              description: "Users grouped by department",
            },
            newUsersThisMonth: {
              type: "number",
              description: "Number of new users this month",
            },
          },
        },
        ApiResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              description: "Whether the request was successful",
            },
            message: {
              type: "string",
              description: "Response message",
            },
            data: {
              type: "object",
              description: "Response data",
            },
          },
        },
        PaginationResponse: {
          type: "object",
          properties: {
            page: {
              type: "number",
              description: "Current page number",
            },
            limit: {
              type: "number",
              description: "Number of items per page",
            },
            total: {
              type: "number",
              description: "Total number of items",
            },
            totalPages: {
              type: "number",
              description: "Total number of pages",
            },
            hasNext: {
              type: "boolean",
              description: "Whether there's a next page",
            },
            hasPrev: {
              type: "boolean",
              description: "Whether there's a previous page",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "User authentication and authorization endpoints",
      },
      {
        name: "Users",
        description: "User management endpoints",
      },
      {
        name: "Tasks",
        description: "Task management endpoints",
      },
      {
        name: "Reports",
        description: "Reporting and analytics endpoints",
      },
    ],
  },
  apis: ["./routes/*.ts", "./controllers/*.ts", "./models/*.ts"],
};

export const specs = swaggerJsdoc(options);
