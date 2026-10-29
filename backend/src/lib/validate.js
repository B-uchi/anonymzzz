import { badRequest } from "./http.js";

export const USERNAME_PATTERN = /^[a-zA-Z0-9_.]{3,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const MESSAGE_MAX_LENGTH = 1000;
export const PROMPT_MAX_LENGTH = 120;
export const PASSWORD_MIN_LENGTH = 6;

const asString = (value) => (typeof value === "string" ? value : "");

export const parseUsername = (value) => {
  const username = asString(value).trim();
  if (!USERNAME_PATTERN.test(username)) {
    throw badRequest(
      "Usernames are 3–20 characters: letters, numbers, dots and underscores."
    );
  }
  return username;
};

export const parseEmail = (value) => {
  const email = asString(value).trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email)) throw badRequest("Enter a valid email address.");
  return email;
};

export const parsePassword = (value, field = "Password") => {
  const password = asString(value);
  if (password.length < PASSWORD_MIN_LENGTH) {
    throw badRequest(`${field} must be at least ${PASSWORD_MIN_LENGTH} characters.`);
  }
  return password;
};

export const parseMessage = (value) => {
  const message = asString(value).trim();
  if (!message) throw badRequest("Write something before sending.");
  if (message.length > MESSAGE_MAX_LENGTH) {
    throw badRequest(`Messages can be up to ${MESSAGE_MAX_LENGTH} characters.`);
  }
  return message;
};

export const parsePrompt = (value) => {
  const prompt = asString(value).trim();
  if (prompt.length > PROMPT_MAX_LENGTH) {
    throw badRequest(`Prompts can be up to ${PROMPT_MAX_LENGTH} characters.`);
  }
  return prompt;
};
