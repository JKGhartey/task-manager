import {
  bulkUpdateUsers,
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getUserStats,
  searchUsers,
  updateUser,
  updateUserRole,
  updateUserStatus,
} from "../controllers/userController";

import asyncHandler from "express-async-handler";
import { authMiddleware } from "../middlewares/authMiddleware";
import express from "express";

const router = express.Router();

router.get("/", authMiddleware, asyncHandler(getAllUsers));
router.get("/stats", authMiddleware, asyncHandler(getUserStats));
router.get("/search", authMiddleware, asyncHandler(searchUsers));
router.get("/:id", authMiddleware, asyncHandler(getUserById));
router.post("/", authMiddleware, asyncHandler(createUser));
router.put("/:id", authMiddleware, asyncHandler(updateUser));
router.delete("/:id", authMiddleware, asyncHandler(deleteUser));
router.patch("/:id/status", authMiddleware, asyncHandler(updateUserStatus));
router.patch("/:id/role", authMiddleware, asyncHandler(updateUserRole));
router.patch("/bulk-update", authMiddleware, asyncHandler(bulkUpdateUsers));

export default router;
