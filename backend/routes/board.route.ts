import express from "express";
import { createBoard, getUserBoards } from '../controllers/board.controller.ts'

const router = express.Router()

router.get("/user/:userId", getUserBoards)
router.post("/", createBoard)

export default router