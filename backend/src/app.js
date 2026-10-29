import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./lib/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errors.js";
import routes from "./routes.js";

const app = express();

// Render and Vercel sit behind a proxy; this makes rate limiting see real IPs.
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGINS }));
app.use(express.json({ limit: "20kb" }));

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});
app.use(routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
