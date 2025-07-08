import { Request, Response } from "express";
import User, { UserRole, UserStatus } from "../models/User";

import type { Secret } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { authMiddleware } from "../middlewares/authMiddleware";
import bcrypt from "bcrypt";
import crypto from "crypto";
import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "7d";

// Helper function to generate JWT token
const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as any,
  });
};

// Helper function to generate random token
const generateRandomToken = (): string => {
  return crypto.randomBytes(32).toString("hex");
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  "/register",
  asyncHandler(async (req: Request, res: Response) => {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      department,
      position,
      dateOfBirth,
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

    // Create email verification token
    const emailVerificationToken = generateRandomToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      department,
      position,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      emailVerificationToken,
      emailVerificationExpires,
    });

    await user.save();

    // Generate JWT token
    const token = generateToken((user._id as any).toString(), user.role);

    // TODO: Send email verification email here
    // For now, we'll just return the token

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          status: user.status,
          isEmailVerified: user.isEmailVerified,
        },
        token,
      },
    });
  })
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Check if account is locked
    if (user.isLocked()) {
      res.status(423).json({
        success: false,
        message: "Account is locked due to too many failed login attempts",
      });
      return;
    }

    // Check if account is active
    if (user.status !== UserStatus.ACTIVE) {
      res.status(401).json({
        success: false,
        message: "Account is not active",
      });
      return;
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Increment login attempts
      await user.incrementLoginAttempts();
      res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken((user._id as any).toString(), user.role);

    res.json({
      success: true,
      message: "Login successful",
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
          department: user.department,
          position: user.position,
        },
        token,
      },
    });
  })
);

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post("/logout", authMiddleware, (req, res) => {
  // Since JWT is stateless, we just return success
  // The client should remove the token from storage
  res.json({
    success: true,
    message: "Logout successful",
  });
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get(
  "/me",
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById((req.user as any).userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }
    res.json({
      success: true,
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
  })
);

// @route   POST /api/auth/verify-email
// @desc    Verify email with token
// @access  Public
router.post("/verify-email", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({
      success: false,
      message: "Verification token is required",
    });
    return;
  }

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: Date.now() },
  }).select("+emailVerificationToken +emailVerificationExpires");

  if (!user) {
    res.status(400).json({
      success: false,
      message: "Invalid or expired verification token",
    });
    return;
  }

  // Mark email as verified
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  res.json({
    success: true,
    message: "Email verified successfully",
  });
});

// @route   POST /api/auth/resend-verification
// @desc    Resend email verification
// @access  Public
router.post("/resend-verification", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({
      success: false,
      message: "Email is required",
    });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  if (user.isEmailVerified) {
    res.status(400).json({
      success: false,
      message: "Email is already verified",
    });
    return;
  }

  // Generate new verification token
  const emailVerificationToken = generateRandomToken();
  const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  user.emailVerificationToken = emailVerificationToken;
  user.emailVerificationExpires = emailVerificationExpires;
  await user.save();

  // TODO: Send email verification email here

  res.json({
    success: true,
    message: "Verification email sent successfully",
  });
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({
      success: false,
      message: "Email is required",
    });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if user exists or not for security
    res.json({
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent",
    });
    return;
  }

  // Generate password reset token
  const passwordResetToken = generateRandomToken();
  const passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  user.passwordResetToken = passwordResetToken;
  user.passwordResetExpires = passwordResetExpires;
  await user.save();

  // TODO: Send password reset email here

  res.json({
    success: true,
    message:
      "If an account with that email exists, a password reset link has been sent",
  });
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    res.status(400).json({
      success: false,
      message: "Token and new password are required",
    });
    return;
  }

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user) {
    res.status(400).json({
      success: false,
      message: "Invalid or expired reset token",
    });
    return;
  }

  // Update password
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.json({
    success: true,
    message: "Password reset successfully",
  });
});

// @route   PUT /api/auth/change-password
// @desc    Change password (authenticated user)
// @access  Private
router.put("/change-password", authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400).json({
      success: false,
      message: "Current password and new password are required",
    });
    return;
  }

  const user = await User.findById((req.user as any).userId).select(
    "+password"
  );
  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    res.status(400).json({
      success: false,
      message: "Current password is incorrect",
    });
    return;
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: "Password changed successfully",
  });
});

// @route   POST /api/auth/refresh-token
// @desc    Refresh JWT token
// @access  Private
router.post("/refresh-token", authMiddleware, async (req, res) => {
  const user = await User.findById((req.user as any).userId);
  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  // Check if user is still active
  if (user.status !== UserStatus.ACTIVE) {
    res.status(401).json({
      success: false,
      message: "User account is not active",
    });
    return;
  }

  // Generate new token
  const token = generateToken((user._id as any).toString(), user.role);

  res.json({
    success: true,
    message: "Token refreshed successfully",
    data: {
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status,
        isEmailVerified: user.isEmailVerified,
      },
    },
  });
});

export default router;
