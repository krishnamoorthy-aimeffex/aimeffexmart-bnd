import { Router } from "express";
import { updateProfile, getUserCount } from "../controllers/users.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User APIs
 */

/**
 * @swagger
 * /api/users/update-profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: Krishnamoorthy D
 *               email:
 *                 type: string
 *                 example: krishna@example.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put("/update-profile", authMiddleware, updateProfile);

/**
 * @swagger
 * /api/users/count:
 *   get:
 *     summary: Get total user count
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Total number of users
 */
router.get("/count", getUserCount);

export default router;
