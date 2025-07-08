import { Request, Response } from "express";
import User, { UserRole, UserStatus } from "../models/User";

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const role = req.query.role as string;
    const status = req.query.status as string;
    const department = req.query.department as string;

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      query.role = role;
    }

    if (status) {
      query.status = status;
    }

    if (department) {
      query.department = { $regex: department, $options: "i" };
    }

    const users = await User.find(query)
      .select(
        "-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires -loginAttempts -lockUntil"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires -loginAttempts -lockUntil"
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Create new user (Admin only)
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      status,
      phone,
      department,
      position,
      dateOfBirth,
      hireDate,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
      return;
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role: role || UserRole.USER,
      status: status || UserStatus.ACTIVE,
      phone,
      department,
      position,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      hireDate: hireDate ? new Date(hireDate) : new Date(),
      isEmailVerified: true, // Admin-created users are automatically verified
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          status: user.status,
          isEmailVerified: user.isEmailVerified,
          avatar: user.avatar,
          phone: user.phone,
          department: user.department,
          position: user.position,
          dateOfBirth: user.dateOfBirth,
          hireDate: user.hireDate,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      email,
      role,
      status,
      phone,
      department,
      position,
      dateOfBirth,
      hireDate,
    } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
        return;
      }
      user.email = email;
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (role) user.role = role;
    if (status) user.status = status;
    if (phone) user.phone = phone;
    if (department) user.department = department;
    if (position) user.position = position;
    if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
    if (hireDate) user.hireDate = new Date(hireDate);

    await user.save();

    res.json({
      success: true,
      message: "User updated successfully",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          status: user.status,
          isEmailVerified: user.isEmailVerified,
          avatar: user.avatar,
          phone: user.phone,
          department: user.department,
          position: user.position,
          dateOfBirth: user.dateOfBirth,
          hireDate: user.hireDate,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Prevent deletion of admin users
    if (user.role === UserRole.ADMIN) {
      res.status(400).json({
        success: false,
        message: "Cannot delete admin users",
      });
      return;
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Update user status (Admin only)
// @route   PATCH /api/users/:id/status
// @access  Private/Admin
export const updateUserStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.body;

    if (!status || !Object.values(UserStatus).includes(status)) {
      res.status(400).json({
        success: false,
        message: "Valid status is required",
      });
      return;
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Prevent status change of admin users
    if (user.role === UserRole.ADMIN) {
      res.status(400).json({
        success: false,
        message: "Cannot change status of admin users",
      });
      return;
    }

    user.status = status;
    await user.save();

    res.json({
      success: true,
      message: "User status updated successfully",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      },
    });
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Update user role (Admin only)
// @route   PATCH /api/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { role } = req.body;

    if (!role || !Object.values(UserRole).includes(role)) {
      res.status(400).json({
        success: false,
        message: "Valid role is required",
      });
      return;
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Prevent role change of admin users
    if (user.role === UserRole.ADMIN) {
      res.status(400).json({
        success: false,
        message: "Cannot change role of admin users",
      });
      return;
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: "User role updated successfully",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      },
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Get user statistics (Admin only)
// @route   GET /api/users/stats
// @access  Private/Admin
export const getUserStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      status: UserStatus.ACTIVE,
    });
    const inactiveUsers = await User.countDocuments({
      status: UserStatus.INACTIVE,
    });
    const suspendedUsers = await User.countDocuments({
      status: UserStatus.SUSPENDED,
    });

    const adminUsers = await User.countDocuments({ role: UserRole.ADMIN });
    const managerUsers = await User.countDocuments({ role: UserRole.MANAGER });
    const regularUsers = await User.countDocuments({ role: UserRole.USER });

    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    const unverifiedUsers = await User.countDocuments({
      isEmailVerified: false,
    });

    // Get users by department
    const departmentStats = await User.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        statusBreakdown: {
          active: activeUsers,
          inactive: inactiveUsers,
          suspended: suspendedUsers,
        },
        roleBreakdown: {
          admin: adminUsers,
          manager: managerUsers,
          user: regularUsers,
        },
        verificationBreakdown: {
          verified: verifiedUsers,
          unverified: unverifiedUsers,
        },
        departmentStats,
        recentRegistrations,
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Bulk update users (Admin only)
// @route   PATCH /api/users/bulk-update
// @access  Private/Admin
export const bulkUpdateUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userIds, updates } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      res.status(400).json({
        success: false,
        message: "User IDs array is required",
      });
      return;
    }

    if (!updates || typeof updates !== "object") {
      res.status(400).json({
        success: false,
        message: "Updates object is required",
      });
      return;
    }

    // Remove sensitive fields from updates
    const { password, email, ...safeUpdates } = updates;

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { $set: safeUpdates }
    );

    res.json({
      success: true,
      message: `Updated ${result.modifiedCount} users successfully`,
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount,
      },
    });
  } catch (error) {
    console.error("Bulk update users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// @desc    Search users (Admin only)
// @route   GET /api/users/search
// @access  Private/Admin
export const searchUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { q, role, status, department } = req.query;
    const limit = parseInt(req.query.limit as string) || 20;

    if (!q) {
      res.status(400).json({
        success: false,
        message: "Search query is required",
      });
      return;
    }

    // Build search query
    const query: any = {
      $or: [
        { firstName: { $regex: q as string, $options: "i" } },
        { lastName: { $regex: q as string, $options: "i" } },
        { email: { $regex: q as string, $options: "i" } },
        { department: { $regex: q as string, $options: "i" } },
        { position: { $regex: q as string, $options: "i" } },
      ],
    };

    if (role) query.role = role;
    if (status) query.status = status;
    if (department)
      query.department = { $regex: department as string, $options: "i" };

    const users = await User.find(query)
      .select("firstName lastName email role status department position avatar")
      .limit(limit)
      .sort({ firstName: 1, lastName: 1 });

    res.json({
      success: true,
      data: { users },
    });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
