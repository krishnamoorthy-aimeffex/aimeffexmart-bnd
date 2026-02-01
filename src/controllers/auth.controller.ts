import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

/**
 * SIGNUP
 */
export const signup = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, mobile, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with email or mobile",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      mobile,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Signup successful",
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * LOGIN (email OR mobile)
 */
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, mobile, password } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
