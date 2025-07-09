import {
  authMiddleware,
  requireAdmin,
  requireAdminOrManager,
} from "../middlewares/authMiddleware";
import {
  createDepartment,
  deleteDepartment,
  getActiveDepartments,
  getAllDepartments,
  getDepartmentById,
  getDepartmentStats,
  updateDepartment,
} from "../controllers/departmentController";

import asyncHandler from "express-async-handler";
import express from "express";

const router = express.Router();

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: Get all departments with filtering and pagination (Admin/Manager only)
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name, description, or code
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, archived]
 *         description: Filter by department status
 *     responses:
 *       200:
 *         description: Departments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     departments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Department'
 *                     pagination:
 *                       $ref: '#/components/schemas/PaginationResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin/manager access required
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  authMiddleware,
  requireAdminOrManager,
  asyncHandler(getAllDepartments)
);

/**
 * @swagger
 * /api/departments/stats:
 *   get:
 *     summary: Get department statistics (Admin/Manager only)
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Department statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/DepartmentStatsResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin/manager access required
 *       500:
 *         description: Internal server error
 */
router.get(
  "/stats",
  authMiddleware,
  requireAdminOrManager,
  asyncHandler(getDepartmentStats)
);

/**
 * @swagger
 * /api/departments/active:
 *   get:
 *     summary: Get active departments for dropdown (Admin/Manager only)
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active departments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     departments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Department'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin/manager access required
 *       500:
 *         description: Internal server error
 */
router.get(
  "/active",
  authMiddleware,
  requireAdminOrManager,
  asyncHandler(getActiveDepartments)
);

/**
 * @swagger
 * /api/departments/{id}:
 *   get:
 *     summary: Get department by ID (Admin only)
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID
 *     responses:
 *       200:
 *         description: Department retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     department:
 *                       $ref: '#/components/schemas/Department'
 *                     employees:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin access required
 *       404:
 *         description: Department not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:id",
  authMiddleware,
  requireAdminOrManager,
  asyncHandler(getDepartmentById)
);

/**
 * @swagger
 * /api/departments:
 *   post:
 *     summary: Create a new department (Admin only)
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDepartmentRequest'
 *     responses:
 *       201:
 *         description: Department created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Department created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     department:
 *                       $ref: '#/components/schemas/Department'
 *       400:
 *         description: Bad request - validation error or department already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin access required
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  authMiddleware,
  requireAdminOrManager,
  asyncHandler(createDepartment)
);

/**
 * @swagger
 * /api/departments/{id}:
 *   put:
 *     summary: Update a department (Admin only)
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDepartmentRequest'
 *     responses:
 *       200:
 *         description: Department updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Department updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     department:
 *                       $ref: '#/components/schemas/Department'
 *       400:
 *         description: Bad request - validation error or department already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin access required
 *       404:
 *         description: Department not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id",
  authMiddleware,
  requireAdminOrManager,
  asyncHandler(updateDepartment)
);

/**
 * @swagger
 * /api/departments/{id}:
 *   delete:
 *     summary: Delete a department (Admin only)
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID
 *     responses:
 *       200:
 *         description: Department deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Department deleted successfully
 *       400:
 *         description: Bad request - department has active employees
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin access required
 *       404:
 *         description: Department not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  authMiddleware,
  requireAdminOrManager,
  asyncHandler(deleteDepartment)
);

// Public view routes - accessible to all authenticated users
/**
 * @swagger
 * /api/departments/public:
 *   get:
 *     summary: Get all departments with filtering and pagination (All authenticated users)
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name, description, or code
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, archived]
 *         description: Filter by department status
 *     responses:
 *       200:
 *         description: Departments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     departments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Department'
 *                     pagination:
 *                       $ref: '#/components/schemas/PaginationResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/public", authMiddleware, asyncHandler(getAllDepartments));

/**
 * @swagger
 * /api/departments/public/active:
 *   get:
 *     summary: Get active departments for dropdown (All authenticated users)
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active departments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     departments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Department'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/public/active",
  authMiddleware,
  asyncHandler(getActiveDepartments)
);

export default router;
