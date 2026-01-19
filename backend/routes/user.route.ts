import express from "express";
import { createUser, deleteUser, getUser, getUsers, updateUser } from '../controllers/user.controller.ts'

const router = express.Router()

router.get("/:id", getUser)
router.get("/", getUsers)
router.post("/create", createUser)
router.post("/update/:id", updateUser)
router.post("/delete/:id", deleteUser)


export default router