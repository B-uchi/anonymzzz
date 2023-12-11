import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    message: { required: true, type: String},
  },
  { timestamps: true }
);

export const Message = mongoose.model("message", messageSchema);
