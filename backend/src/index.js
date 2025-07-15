import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";

import { connectDB } from "./lib/db.js";

const PORT = process.env.PORT || 5001;

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
