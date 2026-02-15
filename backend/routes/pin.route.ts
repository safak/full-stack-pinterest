import express from "express";
import { createPin, deletePin, getPin, getPins, getSavedPins, interactionCheck, interactPin, updatePin } from '../controllers/pin.controller.ts'
import verifyToken from "../middleware/verifyToken.ts";

const router = express.Router()

router.get("/", getPins)
router.post("/", verifyToken, createPin)
router.patch("/:id", verifyToken, updatePin)
router.get("/:id", getPin)
router.delete("/:id", verifyToken, deletePin)
router.post("/interact/:id", verifyToken, interactPin)
router.get("/interaction-check/:id", interactionCheck)
router.get("/saved-pins/:userId", getSavedPins)

export default router