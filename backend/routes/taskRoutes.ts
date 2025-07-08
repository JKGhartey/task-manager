import {
  addComment,
  addSubtask,
  completeSubtask,
  createTask,
  deleteTask,
  getAllTasks,
  getMyTasks,
  getTaskById,
  getTaskStats,
  getTasksCreatedByMe,
  updateTask,
  updateTaskStatus,
} from "../controllers/taskController";

import asyncHandler from "express-async-handler";
import { authMiddleware } from "../middlewares/authMiddleware";
import express from "express";

const router = express.Router();

router.get("/", authMiddleware, asyncHandler(getAllTasks));
router.get("/my-tasks", authMiddleware, asyncHandler(getMyTasks));
router.get("/created-by-me", authMiddleware, asyncHandler(getTasksCreatedByMe));
router.get("/stats", authMiddleware, asyncHandler(getTaskStats));
router.get("/:id", authMiddleware, asyncHandler(getTaskById));
router.post("/", authMiddleware, asyncHandler(createTask));
router.put("/:id", authMiddleware, asyncHandler(updateTask));
router.delete("/:id", authMiddleware, asyncHandler(deleteTask));
router.patch("/:id/status", authMiddleware, asyncHandler(updateTaskStatus));
router.post("/:id/comments", authMiddleware, asyncHandler(addComment));
router.post("/:id/subtasks", authMiddleware, asyncHandler(addSubtask));
router.patch(
  "/:id/subtasks/:subtaskIndex",
  authMiddleware,
  asyncHandler(completeSubtask)
);

export default router;
