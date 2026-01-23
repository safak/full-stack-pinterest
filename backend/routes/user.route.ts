import express from "express";
import verifyToken from "../middleware/verifyToken.ts";
import { deleteUser, followUser, getUser, getUsers, updateUser } from '../controllers/user.controller.ts'

const router = express.Router()

router.get("/:id", getUser)
router.get("/", getUsers)
router.patch("/update/:id", updateUser)
router.post("/follow/:username", verifyToken, followUser)
router.post("/delete/:id", deleteUser)


export default router