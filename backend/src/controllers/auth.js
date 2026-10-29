import bcryptjs from "bcryptjs";
import { createToken } from "../lib/crypto.js";
import { badRequest, conflict } from "../lib/http.js";
import { parseEmail, parsePassword, parseUsername } from "../lib/validate.js";
import { caseInsensitive, User } from "../models/user.js";

const session = (user) => ({ token: createToken(user._id), user: user.toProfile() });

export const register = async (req, res) => {
  const username = parseUsername(req.body?.username);
  const email = parseEmail(req.body?.email);
  const password = parsePassword(req.body?.password);

  if (await User.findByUsername(username)) {
    throw conflict("That username is taken. Try another.");
  }
  if (await User.findOne({ email }).collation(caseInsensitive)) {
    throw conflict("An account with that email already exists. Log in instead.");
  }

  const user = await User.create({
    username,
    email,
    password: await bcryptjs.hash(password, 10),
  });
  res.status(201).json(session(user));
};

export const login = async (req, res) => {
  const identifier = String(req.body?.identifier ?? req.body?.email ?? "").trim();
  const password = String(req.body?.password ?? "");
  if (!identifier || !password) {
    throw badRequest("Enter your email or username and your password.");
  }

  const field = identifier.includes("@") ? "email" : "username";
  const user = await User.findOne({ [field]: identifier })
    .collation(caseInsensitive)
    .select("+password");

  if (!user || !(await bcryptjs.compare(password, user.password))) {
    throw badRequest("Those details don't match an account.");
  }
  res.json(session(user));
};

export const me = (req, res) => {
  res.json({ user: req.user.toProfile() });
};
