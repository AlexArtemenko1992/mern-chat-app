import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { updateProfile } from "../controllers/profile.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectedRoute, updateProfile);

export default router;
