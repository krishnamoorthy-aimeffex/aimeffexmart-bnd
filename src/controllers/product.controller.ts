import { Request, Response } from "express";
import Product from "../models/Products";

// POST - Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, image, rating, reviews, price, originalPrice, description, category, stock } = req.body;

    // Validation
    if (!name || !price || !description || !category || !image) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, price, description, category, image",
      });
    }

    const newProduct = new Product({
      name,
      image,
      rating: rating || 0,
      reviews: reviews || 0,
      price,
      originalPrice: originalPrice || price,
      description,
      category,
      stock: stock || 0,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: savedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: (error as Error).message,
    });
  }
};

// GET - Fetch all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: (error as Error).message,
    });
  }
};

// GET - Get product count
export const getProductCount = async (req: Request, res: Response) => {
  try {
    const count = await Product.countDocuments();
    res.status(200).json({
      success: true,
      count: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product count",
      error: (error as Error).message,
    });
  }
};

// GET - Fetch a single product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: (error as Error).message,
    });
  }
};

// UPDATE - Update a product by ID
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: (error as Error).message,
    });
  }
};

// DELETE - Delete a product by ID
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: (error as Error).message,
    });
  }
};

// GET - Fetch products by category
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });

    res.status(200).json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products by category",
      error: (error as Error).message,
    });
  }
};
