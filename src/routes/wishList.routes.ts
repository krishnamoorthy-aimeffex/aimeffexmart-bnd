import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware";
import {
  addToWishList,
  getWishList,
  removeFromWishList,
  clearWishList,
  getWishListCount,
} from "../controllers/wistList.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: WishList
 *   description: Wishlist APIs
 */

/**
 * @swagger
 * /api/wishlist/add:
 *   post:
 *     summary: Add product to wishlist
 *     tags: [WishList]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 65a1b2c3d4e5f6g7h8i9j0k1
 *     responses:
 *       201:
 *         description: Added to wishlist
 *       400:
 *         description: Bad request or already exists
 *       401:
 *         description: Unauthorized
 */
router.post("/add", authMiddleware, addToWishList);

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get wishlist for current user
 *     tags: [WishList]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, getWishList);

/**
 * @swagger
 * /api/wishlist/count:
 *   get:
 *     summary: Get wishlist count for current user
 *     tags: [WishList]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist count
 *       401:
 *         description: Unauthorized
 */
router.get("/count", authMiddleware, getWishListCount);

/**
 * @swagger
 * /api/wishlist/{wishItemId}:
 *   delete:
 *     summary: Remove item from wishlist
 *     tags: [WishList]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: wishItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Wishlist item ID
 *     responses:
 *       200:
 *         description: Removed from wishlist
 *       404:
 *         description: Item not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:wishItemId", authMiddleware, removeFromWishList);

/**
 * @swagger
 * /api/wishlist/clear:
 *   delete:
 *     summary: Clear wishlist for current user
 *     tags: [WishList]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist cleared
 *       401:
 *         description: Unauthorized
 */
router.delete("/clear", authMiddleware, clearWishList);

export default router;
