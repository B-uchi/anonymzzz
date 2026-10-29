import Cryptr from "cryptr";
import jwt from "jsonwebtoken";
import { env } from "./env.js";

const cryptr = new Cryptr(env.ENCRYPTION_KEY);

export const encrypt = (text) => cryptr.encrypt(text);

export const decrypt = (text) => {
  try {
    return cryptr.decrypt(text);
  } catch {
    return null;
  }
};

export const createToken = (userId) =>
  jwt.sign({ id: userId.toString() }, env.JWT_SECRET, { expiresIn: "30d" });

export const verifyToken = (token) => jwt.verify(token, env.JWT_SECRET);
