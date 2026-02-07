import { Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth.middleware";

/**
 * UPDATE USER PROFILE
 */
export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { fullname, phone } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name: fullname, mobile: phone },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        fullname: user.name,
        email: user.email,
        phone: user.mobile,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET USER COUNT
 */
export const getUserCount = async (
  req: any,
  res: Response
): Promise<Response> => {
  try {
    const count = await User.countDocuments();
    return res.status(200).json({
      success: true,
      count: count,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Error fetching user count",
      error: error.message,
    });
  }
};
