import { NextFunction, Request, Response } from "express";

import User from "../models/User";
import jwt from "jsonwebtoken";

// Extend Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
      return;
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        role: string;
      };

      // Check if user still exists
      const user = await User.findById(decoded.userId);
      if (!user) {
        res.status(401).json({
          success: false,
          message: "Token is valid but user no longer exists.",
        });
        return;
      }

      // Check if user is active
      if (user.status !== "active") {
        console.log(
          "User status check failed:",
          user.status,
          "expected: active"
        );
        res.status(401).json({
          success: false,
          message: "User account is not active.",
        });
        return;
      }

      // Add user info to request
      req.user = {
        userId: decoded.userId,
        role: decoded.role,
      };

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
      return;
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error in authentication.",
    });
    return;
  }
};

// Optional middleware for role-based access control
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Access denied. Authentication required.",
      });
      return;
    }

    console.log(
      "Role check - User role:",
      req.user.role,
      "Required roles:",
      roles
    );

    if (!roles.includes(req.user.role)) {
      console.log("Role check failed - User role not in required roles");
      res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
      return;
    }

    console.log("Role check passed");
    next();
  };
};

// Middleware for admin access only
export const requireAdmin = requireRole(["admin"]);

// Middleware for admin or manager access
export const requireAdminOrManager = requireRole(["admin", "manager"]);
