import { getIO } from "../utils/socket.ts"
import Notification from "../models/notification.model.ts"

export const createNotificationService = async (data: any) => {
  try {
    const newNotification = new Notification(data)
    await newNotification.save()
    try {
      const io = getIO()
      io.to(newNotification.receiver.toString()).emit("notification", {
        action: "notification",
        data: newNotification,
      })
    } catch (err) {
      // non-fatal if sockets unavailable
    }
    return newNotification
  } catch (err) {
    console.error("Failed to create notification", err)
    throw err
  }
}

export const sendSocketNotification = (userId: string, payload: any) => {
  try {
    const io = getIO()
    io.to(userId).emit("notification", payload)
  } catch (err) {
    console.error("Failed to send socket notification", err)
  }
}
