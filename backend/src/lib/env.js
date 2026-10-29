const required = ["MONGODB_URL", "JWT_SECRET", "ENCRYPTION_KEY"];
const missing = required.filter((key) => !process.env[key]?.trim());
if (missing.length) {
  throw new Error(`Missing environment variables: ${missing.join(", ")}`);
}

export const env = {
  PORT: Number(process.env.PORT) || 5555,
  MONGODB_URL: process.env.MONGODB_URL.trim(),
  JWT_SECRET: process.env.JWT_SECRET.trim(),
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY.trim(),
  CLIENT_ORIGINS: (
    process.env.CLIENT_ORIGINS ||
    "https://anonymzzz.vercel.app,http://localhost:5173"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};
