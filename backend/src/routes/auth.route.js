import express from "express";
import {
  register,
  login,
  logout,
  checkAuth,
} from "../controllers/auth.controller.js";
import protectRoute from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/check", protectRoute, checkAuth);

export default router;
