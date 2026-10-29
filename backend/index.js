import "dotenv/config";
import mongoose from "mongoose";
import app from "./src/app.js";
import { env } from "./src/lib/env.js";

mongoose
  .connect(env.MONGODB_URL)
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`Server started on port ${env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Could not connect to MongoDB", error);
    process.exit(1);
  });
