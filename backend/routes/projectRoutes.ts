import {
  assignTaskToProject,
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  removeTaskFromProject,
  updateProject,
} from "../controllers/projectController";
import {
  authMiddleware,
  requireAdminOrManager,
} from "../middlewares/authMiddleware";

import express from "express";

const router = express.Router();

// Helper to wrap async route handlers
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// All routes require authentication and admin/manager role
router.use(authMiddleware);
router.use(requireAdminOrManager);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Projects retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin/manager access required
 */
router.get("/", asyncHandler(getAllProjects));

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin/manager access required
 *       404:
 *         description: Project not found
 */
router.get("/:id", asyncHandler(getProjectById));

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               team:
 *                 type: string
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin/manager access required
 */
router.post("/", asyncHandler(createProject));

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               team:
 *                 type: string
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin/manager access required
 *       404:
 *         description: Project not found
 */
router.put("/:id", asyncHandler(updateProject));

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin/manager access required
 *       404:
 *         description: Project not found
 */
router.delete("/:id", asyncHandler(deleteProject));

/**
 * @swagger
 * /api/projects/{id}/assign-task:
 *   post:
 *     summary: Assign a task to a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task assigned to project
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin/manager access required
 *       404:
 *         description: Project or task not found
 */
router.post("/:id/assign-task", asyncHandler(assignTaskToProject));

/**
 * @swagger
 * /api/projects/{id}/remove-task:
 *   post:
 *     summary: Remove a task from a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task removed from project
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin/manager access required
 *       404:
 *         description: Project or task not found
 */
router.post("/:id/remove-task", asyncHandler(removeTaskFromProject));

export default router;
