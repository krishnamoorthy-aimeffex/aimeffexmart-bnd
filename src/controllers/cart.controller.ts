import { Response } from "express";
import CartItem from "../models/Cart";
import Product from "../models/Products";
import { AuthRequest } from "../middleware/auth.middleware";

/**
 * ADD ITEM TO CART
 */
export const addToCart = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.userId;

    // Validate input
    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "Product ID and quantity are required" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check stock availability
    if (product.stock && product.stock < quantity) {
      return res.status(400).json({
        message: `Insufficient stock. Available: ${product.stock}`,
      });
    }

    // Check if item already in cart
    let cartItem = await CartItem.findOne({ productId, userId });

    if (cartItem) {
      // Update quantity if item already exists
      cartItem.quantity += quantity;
      if (product.stock && cartItem.quantity > product.stock) {
        return res.status(400).json({
          message: `Cannot exceed available stock of ${product.stock}`,
        });
      }
      await cartItem.save();
      return res.status(200).json({
        message: "Cart updated successfully",
        data: cartItem,
      });
    }

    // Create new cart item
    const newCartItem = await CartItem.create({
      productId,
      quantity,
      userId,
    });

    return res.status(201).json({
      message: "Item added to cart successfully",
      data: newCartItem,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET CART ITEMS (For logged-in user)
 */
export const getCart = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.userId;

    const cartItems = await CartItem.find({ userId }).populate("productId");

    if (!cartItems || cartItems.length === 0) {
      return res
        .status(200)
        .json({ message: "Cart is empty", data: [], total: 0 });
    }

    // Calculate total price
    const total = cartItems.reduce((sum, item: any) => {
      return sum + item.productId.price * item.quantity;
    }, 0);

    return res.status(200).json({
      message: "Cart retrieved successfully",
      data: cartItems,
      total: total.toFixed(2),
      itemCount: cartItems.length,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE CART ITEM QUANTITY
 */
export const updateCartQuantity = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    const userId = req.userId;

    if (!quantity || quantity < 1) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than 0" });
    }

    // Find cart item
    const cartItem = await CartItem.findById(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Verify ownership
    if (cartItem.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this item" });
    }

    // Check product stock
    const product = await Product.findById(cartItem.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock && quantity > product.stock) {
      return res.status(400).json({
        message: `Cannot exceed available stock of ${product.stock}`,
      });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    return res.status(200).json({
      message: "Cart item updated successfully",
      data: cartItem,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * REMOVE ITEM FROM CART
 */
export const removeFromCart = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { cartItemId } = req.params;
    const userId = req.userId;

    // Find and verify cart item
    const cartItem = await CartItem.findById(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Verify ownership
    if (cartItem.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this item" });
    }

    await CartItem.findByIdAndDelete(cartItemId);

    return res.status(200).json({
      message: "Item removed from cart successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * CLEAR ENTIRE CART
 */
export const clearCart = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.userId;

    const result = await CartItem.deleteMany({ userId });

    if (result.deletedCount === 0) {
      return res.status(200).json({ message: "Cart is already empty" });
    }

    return res.status(200).json({
      message: "Cart cleared successfully",
      deletedItems: result.deletedCount,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET CART COUNT (Total number of items)
 */
export const getCartCount = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.userId;

    const count = await CartItem.countDocuments({ userId });

    return res.status(200).json({
      message: "Cart count retrieved successfully",
      count,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
