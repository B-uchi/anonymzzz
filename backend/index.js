import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: ["https://anonymzzz.vercel.app", "http://localhost:5173"],
  })
);

const PORT = process.env.PORT || 5555;

app.get("/", (req, res) => {
  res.status(200).send("Successful");
});
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
