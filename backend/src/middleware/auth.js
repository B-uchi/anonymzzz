import { verifyToken } from "../lib/crypto.js";
import { unauthorized } from "../lib/http.js";
import { User } from "../models/user.js";

export const requireAuth = async (req, res, next) => {
  const header = req.header("Authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (!token) throw unauthorized();

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw unauthorized("Your session has expired. Please log in again.");
  }

  const user = await User.findById(payload.id);
  if (!user) throw unauthorized();
  req.user = user;
  next();
};
