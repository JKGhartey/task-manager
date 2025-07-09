import {
  assignUserToTeam,
  createTeam,
  deleteTeam,
  getAllTeams,
  getTeamById,
  removeUserFromTeam,
  updateTeam,
} from "../controllers/teamController";
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
 * /api/teams:
 *   get:
 *     summary: Get all teams
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teams retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin/manager access required
 */
router.get("/", asyncHandler(getAllTeams));

/**
 * @swagger
 * /api/teams/{id}:
 *   get:
 *     summary: Get team by ID
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
 *     responses:
 *       200:
 *         description: Team retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin/manager access required
 *       404:
 *         description: Team not found
 */
router.get("/:id", asyncHandler(getTeamById));

/**
 * @swagger
 * /api/teams:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
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
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Team created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin/manager access required
 */
router.post("/", asyncHandler(createTeam));

/**
 * @swagger
 * /api/teams/{id}:
 *   put:
 *     summary: Update a team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
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
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Team updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin/manager access required
 *       404:
 *         description: Team not found
 */
router.put("/:id", asyncHandler(updateTeam));

/**
 * @swagger
 * /api/teams/{id}:
 *   delete:
 *     summary: Delete a team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
 *     responses:
 *       200:
 *         description: Team deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin/manager access required
 *       404:
 *         description: Team not found
 */
router.delete("/:id", asyncHandler(deleteTeam));

/**
 * @swagger
 * /api/teams/{id}/assign-user:
 *   post:
 *     summary: Assign a user to a team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User assigned to team
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin/manager access required
 *       404:
 *         description: Team or user not found
 */
router.post("/:id/assign-user", asyncHandler(assignUserToTeam));

/**
 * @swagger
 * /api/teams/{id}/remove-user:
 *   post:
 *     summary: Remove a user from a team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User removed from team
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin/manager access required
 *       404:
 *         description: Team or user not found
 */
router.post("/:id/remove-user", asyncHandler(removeUserFromTeam));

export default router;
