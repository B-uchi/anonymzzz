import mongoose from "mongoose";
import { decrypt } from "../lib/crypto.js";

const messageSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "user", index: true },
    message: { required: true, type: String },
    read: { type: Boolean, default: false },
    starred: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.index({ recipient: 1, createdAt: -1 });

messageSchema.methods.toClient = function () {
  return {
    id: this._id,
    text: decrypt(this.message) ?? "This message couldn't be decrypted.",
    read: this.read,
    starred: this.starred,
    createdAt: this.createdAt,
  };
};

export const Message = mongoose.model("message", messageSchema);
