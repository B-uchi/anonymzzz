import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import Cryptr from "cryptr";

const cryptr = new Cryptr(process.env.ENCRYPTION_KEY);
export const generateUserLink = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    const url = `https://anonymzzz.vercel.app/${user.username}/zzz`;
    return res.status(201).json({ url });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const verifyUser = async (req, res) => {
  try {
    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyUserLink = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid link" });
    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { username, message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Provide a message." });
    }
    const user = await User.findOne({ username });
    const encrypted_message = cryptr.encrypt(message);
    const newMsg = new Message({
      message: encrypted_message,
    });
    const savedMsg = await newMsg.save();
    user.messages.push(savedMsg);
    await user.save();
    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    const messages = user.messages;
    const decrypted_messages = messages.map((msg) => ({
      ...msg,
      ['message']: cryptr.decrypt(msg.message),
    }));
    return res.status(200).json({ messages: decrypted_messages });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
