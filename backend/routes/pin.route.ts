import express from "express";
import { createPin, getPin, getPins } from '../controllers/pin.controller.ts'

const router = express.Router()

router.get("/", getPins)
router.get("/create", createPin)
router.get("/:id", getPin)

export default router