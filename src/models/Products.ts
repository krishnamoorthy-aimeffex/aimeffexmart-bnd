import mongoose, { Document, Schema } from "mongoose";

interface IProduct extends Document {
  name: string;
  image?: string;
  rating?: number;
  reviews?: number;
  price: number;
  originalPrice?: number;
  description?: string;
  category?: string;
  stock?: number;
}

const productSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        rating: { type: Number },
        reviews: { type: Number },
        price: { type: Number, required: true },
        originalPrice: { type: Number },
        description: { type: String, required: true },
        category: { type: String, required: true },
        stock: { type: Number, default: 0 },
    },
    { timestamps: true }
)

export default mongoose.model<IProduct>("Product", productSchema);