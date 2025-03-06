import express from "express";
import { getUserBoards } from "../controllers/board.controller.js";

const router = express.Router();

router.get("/:userId", getUserBoards);

export default router;
