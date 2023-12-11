import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { required: true, type: String, unique: true },
    email: { required: true, type: String, unique: true },
    password: { required: true, type: String, min: 6},
    messages: { type: Array, default: [] },
  },
  { timestamps: true }
);

export const User = mongoose.model("user", UserSchema);
