import mongoose from "mongoose";

export const DEFAULT_PROMPT = "Send me an anonymous message";

// Usernames and emails are matched case-insensitively everywhere.
export const caseInsensitive = { locale: "en", strength: 2 };

const UserSchema = new mongoose.Schema(
  {
    username: { required: true, type: String, unique: true, trim: true },
    email: { required: true, type: String, unique: true, trim: true },
    password: { required: true, type: String, select: false },
    prompt: { type: String, default: DEFAULT_PROMPT },
    acceptingMessages: { type: Boolean, default: true },
    // v1 stored messages inline on the user. They're moved into the Message
    // collection the first time the owner opens their inbox.
    messages: { type: Array, default: undefined, select: false },
  },
  { timestamps: true }
);

UserSchema.methods.toProfile = function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    prompt: this.prompt || DEFAULT_PROMPT,
    acceptingMessages: this.acceptingMessages !== false,
    createdAt: this.createdAt,
  };
};

UserSchema.statics.findByUsername = function (username) {
  return this.findOne({ username }).collation(caseInsensitive);
};

export const User = mongoose.model("user", UserSchema);
