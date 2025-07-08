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

/**
 * @swagger
 * /api/reports/dashboard:
 *   get:
 *     summary: Get dashboard overview (tasks, users, recent activity, performance)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard overview data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/dashboard", authMiddleware, asyncHandler(getDashboardOverview));

/**
 * @swagger
 * /api/reports/task-analytics:
 *   get:
 *     summary: Get task analytics (status, priority, type, project, department, monthly trend)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for analytics (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for analytics (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Task analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/task-analytics", authMiddleware, asyncHandler(getTaskAnalytics));

/**
 * @swagger
 * /api/reports/user-performance:
 *   get:
 *     summary: Get user performance analytics
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for analytics (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for analytics (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: User performance data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/user-performance",
  authMiddleware,
  asyncHandler(getUserPerformance)
);

/**
 * @swagger
 * /api/reports/project-report:
 *   get:
 *     summary: Get project report analytics
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: project
 *         required: true
 *         schema:
 *           type: string
 *         description: Project name
 *     responses:
 *       200:
 *         description: Project report data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request - missing project name
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/project-report", authMiddleware, asyncHandler(getProjectReport));

/**
 * @swagger
 * /api/reports/department-report:
 *   get:
 *     summary: Get department report analytics
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Department name
 *     responses:
 *       200:
 *         description: Department report data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/department-report",
  authMiddleware,
  asyncHandler(getDepartmentReport)
);

/**
 * @swagger
 * /api/reports/export:
 *   get:
 *     summary: Export report data (CSV or JSON)
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: reportType
 *         required: true
 *         schema:
 *           type: string
 *           enum: [dashboard, task-analytics, user-performance, project-report, department-report]
 *         description: Type of report to export
 *       - in: query
 *         name: format
 *         required: true
 *         schema:
 *           type: string
 *           enum: [csv, json]
 *         description: Export format
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for export (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for export (YYYY-MM-DD)
 *       - in: query
 *         name: project
 *         schema:
 *           type: string
 *         description: Project name (for project report)
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Department name (for department report)
 *     responses:
 *       200:
 *         description: Report data exported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       400:
 *         description: Bad request - missing or invalid parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/export", authMiddleware, asyncHandler(exportReportData));

export default router;
