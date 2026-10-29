import { notFound } from "../lib/http.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";

const MAX_MESSAGES = 500;

// Moves v1 inline messages into the Message collection. v1 saved each message
// in both places with the same _id, so this links existing documents and only
// recreates the ones that are missing.
const migrateLegacyMessages = async (userId) => {
  const user = await User.findById(userId).select("+messages");
  if (!user?.messages?.length) return;

  await Message.bulkWrite(
    user.messages
      .filter((legacy) => legacy?._id && legacy.message)
      .map((legacy) => ({
        updateOne: {
          filter: { _id: legacy._id },
          update: {
            $set: { recipient: user._id, read: true },
            $setOnInsert: {
              message: legacy.message,
              starred: false,
              createdAt: legacy.createdAt ?? new Date(),
              updatedAt: legacy.updatedAt ?? new Date(),
            },
          },
          upsert: true,
        },
      })),
    { timestamps: false }
  );
  await User.updateOne({ _id: user._id }, { $unset: { messages: 1 } });
};

const ownMessage = async (req) => {
  const message = await Message.findOne({
    _id: req.params.id,
    recipient: req.user._id,
  });
  if (!message) throw notFound("That message no longer exists.");
  return message;
};

export const listMessages = async (req, res) => {
  await migrateLegacyMessages(req.user._id);
  const messages = await Message.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .limit(MAX_MESSAGES);
  res.json({ messages: messages.map((message) => message.toClient()) });
};

export const updateMessage = async (req, res) => {
  const message = await ownMessage(req);
  for (const field of ["read", "starred"]) {
    if (typeof req.body?.[field] === "boolean") message[field] = req.body[field];
  }
  await message.save();
  res.json({ message: message.toClient() });
};

export const deleteMessage = async (req, res) => {
  const message = await ownMessage(req);
  await message.deleteOne();
  res.status(204).end();
};

export const markAllRead = async (req, res) => {
  await Message.updateMany({ recipient: req.user._id, read: false }, { read: true });
  res.status(204).end();
};
