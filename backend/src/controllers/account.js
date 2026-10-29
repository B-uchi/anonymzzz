import bcryptjs from "bcryptjs";
import { badRequest } from "../lib/http.js";
import { parsePassword, parsePrompt } from "../lib/validate.js";
import { Message } from "../models/message.js";
import { DEFAULT_PROMPT, User } from "../models/user.js";

const checkPassword = async (userId, password) => {
  const user = await User.findById(userId).select("+password");
  const valid = await bcryptjs.compare(String(password ?? ""), user.password);
  if (!valid) throw badRequest("Your current password is incorrect.");
  return user;
};

export const updateSettings = async (req, res) => {
  const { prompt, acceptingMessages } = req.body ?? {};
  if (prompt !== undefined) req.user.prompt = parsePrompt(prompt) || DEFAULT_PROMPT;
  if (typeof acceptingMessages === "boolean") {
    req.user.acceptingMessages = acceptingMessages;
  }
  await req.user.save();
  res.json({ user: req.user.toProfile() });
};

export const changePassword = async (req, res) => {
  const newPassword = parsePassword(req.body?.newPassword, "New password");
  const user = await checkPassword(req.user._id, req.body?.currentPassword);
  user.password = await bcryptjs.hash(newPassword, 10);
  await user.save();
  res.status(204).end();
};

export const deleteAccount = async (req, res) => {
  const user = await checkPassword(req.user._id, req.body?.password);
  await Message.deleteMany({ recipient: user._id });
  await user.deleteOne();
  res.status(204).end();
};
