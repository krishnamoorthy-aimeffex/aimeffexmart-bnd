import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email?: string;
  mobile?: string;
  password: string;
  googleId?: string;
  facebookId?: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    mobile: { type: String, unique: true, sparse: true },
    // password: { type: String, required: true },

    password: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    facebookId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
