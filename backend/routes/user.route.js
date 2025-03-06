import express from "express";
import {
  getUser,
  registerUser,
  loginUser,
  logoutUser,
  followUser
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/:username", getUser);
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/logout", logoutUser);
router.post("/follow/:username", verifyToken, followUser);

export default router;
