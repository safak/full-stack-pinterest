import Notification from "../models/notification.model.ts";
import Conversation from "../models/conversation.model.ts";
import { createNotificationService } from "../services/notificationService.ts";

export const createNotification = async (req: any, res: any) => {
  try {
    const payload = req.body
    const newNotification = await createNotificationService(payload)
    res.status(201).json(newNotification)
  } catch (err) {
    res.status(500).json({ message: "Failed to create notification" })
  }
};

export const getNotifications = async (req: any, res: any) => {
  const userId = req.userId
  const notifications = await Notification.find({ receiver: userId }).sort({ createdAt: -1 });
  res.status(200).json({ message: "Notifications retrieved successfully", data: notifications });
}

export const markAsRead = async (req: any, res: any) => {
  const { notificationId, type, entityId } = req.body;

  if (!notificationId && type !== "all" && !entityId) {
    return res.status(400).json({ message: "Neither Notification ID nor Entity ID is provided" });
  }

  if (type && type === "all") {
    await Notification.updateMany(
      { receiver: req.userId, isRead: false },
      { isRead: true }
    );
    return res.status(200).json({ message: "All notifications marked as read" });
  }
  if (notificationId) {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    res.status(200).json({ message: "Notification marked as read", data: notification });
  }
  else if (entityId) {
    const coversations = await Conversation.findById(entityId)
    if (!coversations) {
      return res.status(404).json({ message: "Related conversation not found" });
    }

    const updateResult = await Notification.updateMany(
      { receiver: req.userId, entityId: { $in: coversations.messages } },
      { isRead: true }
    );

    res.status(200).json({ message: "Related notifications marked as read", data: updateResult });
  }

}

export const deleteNotification = async (req: any, res: any) => {
  const { notificationId } = req.params;
  if (!notificationId) {
    return res.status(400).json({ message: "Notification ID is required" });
  }
  await Notification.findByIdAndDelete(notificationId);
  res.status(200).json({ message: "Notification deleted successfully" });
}