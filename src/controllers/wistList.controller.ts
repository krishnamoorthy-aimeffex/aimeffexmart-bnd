import { Response } from "express";
import WishListItem from "../models/WishList";
import Product from "../models/Products";
import { AuthRequest } from "../middleware/auth.middleware";

/**
 * Add product to wishlist
 */
export const addToWishList = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existing = await WishListItem.findOne({ productId, userId });
    if (existing) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    const item = await WishListItem.create({ productId, userId });
    return res.status(201).json({ message: "Added to wishlist", data: item });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Get wishlist for current user
 */
export const getWishList = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.userId;
    const items = await WishListItem.find({ userId }).populate("productId");
    return res.status(200).json({ message: "Wishlist retrieved", data: items, count: items.length });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Remove item from wishlist
 */
export const removeFromWishList = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { wishItemId } = req.params;
    const userId = req.userId;

    const item = await WishListItem.findById(wishItemId);
    if (!item) return res.status(404).json({ message: "Wishlist item not found" });

    if (item.userId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to remove this item" });
    }

    await WishListItem.findByIdAndDelete(wishItemId);
    return res.status(200).json({ message: "Removed from wishlist" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Clear wishlist for user
 */
export const clearWishList = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.userId;
    const result = await WishListItem.deleteMany({ userId });
    return res.status(200).json({ message: "Wishlist cleared", deleted: result.deletedCount });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Get wishlist count
 */
export const getWishListCount = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.userId;
    const count = await WishListItem.countDocuments({ userId });
    return res.status(200).json({ message: "Wishlist count", count });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export default {
  addToWishList,
  getWishList,
  removeFromWishList,
  clearWishList,
  getWishListCount,
};
