import express from "express";
import { createComment, getComments, getPinComments } from '../controllers/comment.controller.ts'


const router = express.Router()

router.get("/", getComments)
router.get("/:pinId", getPinComments)
router.post("/", createComment)

export default router