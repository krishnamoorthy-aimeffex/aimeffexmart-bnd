import mongoose, { Document, Schema } from "mongoose";

interface ICartItem extends Document {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  userId: mongoose.Types.ObjectId;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true, default: 1 },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export default mongoose.model<ICartItem>("CartItem", cartItemSchema);
