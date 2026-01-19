import express from "express";
import { getBoards } from '../controllers/board.controller.ts'

const router = express.Router()

router.get("/", getBoards)

export default router