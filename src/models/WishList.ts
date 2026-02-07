import mongoose, { Document, Schema } from "mongoose";

interface ICartItem extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

const wishListItemSchema = new Schema<ICartItem>(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true },
);

export default mongoose.model<ICartItem>("WishListItem", wishListItemSchema);
    