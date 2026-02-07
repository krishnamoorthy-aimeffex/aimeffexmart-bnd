import { Router } from "express";
import {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  getCartCount,
} from "../controllers/cart.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping Cart Management APIs
 */

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
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
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "65a1b2c3d4e5f6g7h8i9j0k1"
 *               quantity:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *       400:
 *         description: Invalid input or insufficient stock
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
router.post("/add", authMiddleware, addToCart);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get all cart items for logged-in user
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cart items retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, getCart);

/**
 * @swagger
 * /api/cart/count:
 *   get:
 *     summary: Get total count of items in cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cart count retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/count", authMiddleware, getCartCount);

/**
 * @swagger
 * /api/cart/{cartItemId}:
 *   put:
 *     summary: Update quantity of cart item
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       400:
 *         description: Invalid quantity or insufficient stock
 *       404:
 *         description: Cart item not found
 *       403:
 *         description: Not authorized
 */
router.put("/:cartItemId", authMiddleware, updateCartQuantity);

/**
 * @swagger
 * /api/cart/{cartItemId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart item ID
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       404:
 *         description: Cart item not found
 *       403:
 *         description: Not authorized
 */
router.delete("/:cartItemId", authMiddleware, removeFromCart);

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear entire cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/clear", authMiddleware, clearCart);

export default router;
