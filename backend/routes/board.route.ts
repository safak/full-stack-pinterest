import express from "express";
import { createBoard, getUserBoards } from '../controllers/board.controller.ts'
import verifyToken from "../middleware/verifyToken.ts";

const router = express.Router()

router.get("/users", verifyToken, getUserBoards)
router.post("/", createBoard)

export default router