import express from "express";
import {
  generateUserLink,
  getMessages,
  sendMessage,
  verifyUser,
  verifyUserLink,
} from "../controllers/user.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/verify", verifyToken, verifyUser);
router.post("/getLink", verifyToken, generateUserLink);
router.post("/verifyLink", verifyUserLink);
router.post("/sendMessage", sendMessage);
router.post("/messages", verifyToken, getMessages);

export default router;
