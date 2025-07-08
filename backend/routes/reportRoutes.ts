import {
  exportReportData,
  getDashboardOverview,
  getDepartmentReport,
  getProjectReport,
  getTaskAnalytics,
  getUserPerformance,
} from "../controllers/reportController";

import asyncHandler from "express-async-handler";
import { authMiddleware } from "../middlewares/authMiddleware";
import express from "express";

const router = express.Router();

router.get("/dashboard", authMiddleware, asyncHandler(getDashboardOverview));
router.get("/task-analytics", authMiddleware, asyncHandler(getTaskAnalytics));
router.get(
  "/user-performance",
  authMiddleware,
  asyncHandler(getUserPerformance)
);
router.get("/project-report", authMiddleware, asyncHandler(getProjectReport));
router.get(
  "/department-report",
  authMiddleware,
  asyncHandler(getDepartmentReport)
);
router.get("/export", authMiddleware, asyncHandler(exportReportData));

export default router;
