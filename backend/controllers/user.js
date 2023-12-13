import { Message } from "../models/message.js";
import { User } from "../models/user.js";

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
    return res.sendStatus(201)
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
    const newMsg = new Message({
      message,
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
    return res.status(200).json({ messages });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
