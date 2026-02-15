import express from "express";
import { createComment, deleteComment, getComments, getPinComments, updateComment } from '../controllers/comment.controller.ts'
import verifyToken from "../middleware/verifyToken.ts";


const router = express.Router()

router.get("/", getComments)
router.get("/:pinId", getPinComments)
router.post("/", verifyToken, createComment)
router.patch("/:commentId", verifyToken, updateComment)
router.delete("/:commentId", verifyToken, deleteComment)

export default router