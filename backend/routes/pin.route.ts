import express from "express";
import { createPin, getPin, getPins, updatePin } from '../controllers/pin.controller.ts'

const router = express.Router()

router.get("/", getPins)
router.post("/", createPin)
router.patch("/:pinId", updatePin)
router.get("/:id", getPin)

export default router