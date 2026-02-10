import express from "express";
import { createNotification, deleteNotification, getNotifications, markAsRead } from "../controllers/notification.controller.ts";
import verifyToken from "../middleware/verifyToken.ts";


const router = express.Router()

router.get("/", verifyToken, getNotifications)

router.post("/", verifyToken, createNotification)
router.patch("/mark-read", verifyToken, markAsRead)
router.delete("/:notificationId", verifyToken, deleteNotification)

export default router