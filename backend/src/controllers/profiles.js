import { encrypt } from "../lib/crypto.js";
import { HttpError, notFound } from "../lib/http.js";
import { parseMessage } from "../lib/validate.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";

const findProfile = async (username) => {
  const user = await User.findByUsername(String(username));
  if (!user) throw notFound("Nobody goes by that username.");
  return user;
};

export const getProfile = async (req, res) => {
  const user = await findProfile(req.params.username);
  const { username, prompt, acceptingMessages } = user.toProfile();
  res.json({ profile: { username, prompt, acceptingMessages } });
};

export const sendMessage = async (req, res) => {
  const text = parseMessage(req.body?.message);
  const user = await findProfile(req.params.username);
  if (user.acceptingMessages === false) {
    throw new HttpError(403, `${user.username} isn't taking messages right now.`);
  }

  await Message.create({ recipient: user._id, message: encrypt(text) });
  res.status(201).json({ ok: true });
};
