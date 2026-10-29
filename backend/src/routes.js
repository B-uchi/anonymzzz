import express from "express";
import { rateLimit } from "express-rate-limit";
import * as account from "./controllers/account.js";
import * as auth from "./controllers/auth.js";
import * as messages from "./controllers/messages.js";
import * as profiles from "./controllers/profiles.js";
import { requireAuth } from "./middleware/auth.js";

const limiter = (limit, windowMinutes, message) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message },
  });

const authLimiter = limiter(20, 15, "Too many attempts. Wait a few minutes and try again.");
const sendLimiter = limiter(8, 1, "You're sending messages too fast. Take a breath and try again in a minute.");

const router = express.Router();

router.post("/auth/register", authLimiter, auth.register);
router.post("/auth/login", authLimiter, auth.login);
router.get("/auth/me", requireAuth, auth.me);

router.get("/profiles/:username", profiles.getProfile);
router.post("/profiles/:username/messages", sendLimiter, profiles.sendMessage);

router.get("/messages", requireAuth, messages.listMessages);
router.post("/messages/read-all", requireAuth, messages.markAllRead);
router.patch("/messages/:id", requireAuth, messages.updateMessage);
router.delete("/messages/:id", requireAuth, messages.deleteMessage);

router.patch("/account", requireAuth, account.updateSettings);
router.put("/account/password", requireAuth, authLimiter, account.changePassword);
router.delete("/account", requireAuth, authLimiter, account.deleteAccount);

export default router;
