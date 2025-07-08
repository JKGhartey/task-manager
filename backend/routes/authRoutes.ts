import {
  changePassword,
  forgotPassword,
  getMe,
  login,
  logout,
  register,
  resendVerification,
  resetPassword,
  updateProfile,
  verifyEmail,
} from "../controllers/authController";

import asyncHandler from "express-async-handler";
import { authMiddleware } from "../middlewares/authMiddleware";
import express from "express";

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", asyncHandler(register));

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", asyncHandler(login));

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post("/logout", authMiddleware, logout);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get("/me", authMiddleware, asyncHandler(getMe));

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", authMiddleware, asyncHandler(updateProfile));

// @route   PUT /api/auth/change-password
// @desc    Change password
// @access  Private
router.put("/change-password", authMiddleware, asyncHandler(changePassword));

// @route   POST /api/auth/forgot-password
// @desc    Forgot password
// @access  Public
router.post("/forgot-password", asyncHandler(forgotPassword));

// @route   POST /api/auth/reset-password
// @desc    Reset password
// @access  Public
router.post("/reset-password", asyncHandler(resetPassword));

// @route   POST /api/auth/verify-email
// @desc    Verify email
// @access  Public
router.post("/verify-email", asyncHandler(verifyEmail));

// @route   POST /api/auth/resend-verification
// @desc    Resend email verification
// @access  Private
router.post(
  "/resend-verification",
  authMiddleware,
  asyncHandler(resendVerification)
);

export default router;
