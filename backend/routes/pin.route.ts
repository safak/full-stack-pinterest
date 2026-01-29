import express from "express";
import { createPin, getPin, getPins, updatePin } from '../controllers/pin.controller.ts'
import verifyToken from "../middleware/verifyToken.ts";

const router = express.Router()

router.get("/", getPins)
router.post("/", verifyToken, createPin)
router.patch("/:pinId", verifyToken, updatePin)
router.get("/:id", getPin)

export default router