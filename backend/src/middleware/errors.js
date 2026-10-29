import { HttpError } from "../lib/http.js";

export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: "Route not found." });
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (error, req, res, next) => {
  if (error instanceof HttpError) {
    return res.status(error.status).json({ message: error.message });
  }
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Malformed JSON body." });
  }
  if (error.name === "CastError") {
    return res.status(404).json({ message: "Not found." });
  }
  console.error(error);
  res.status(500).json({ message: "Something went wrong on our end. Try again." });
};
