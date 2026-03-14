import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not defined (set it in your environment variables)");
  }

  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (error: any) {
    console.error("❌ MongoDB error:", error.message);
    throw error;
  }
};

export default connectDB;
