import express from "express";
import verifyToken from "../middleware/verifyToken.ts";
import { createImage, deleteImage, getUserImages, updateImage } from "../controllers/image.controller.ts";


const router = express.Router()


router.get("/", verifyToken, getUserImages)
router.post("/", verifyToken, createImage)
router.patch("/:id", verifyToken, updateImage)
router.delete("/:id", verifyToken, deleteImage)

export default router