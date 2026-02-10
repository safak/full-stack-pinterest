import type { NotificationType } from "@/types/domain/notification.types";
import api from "../axios";


export const getNotifications = () => api.get<NotificationType[]>(`/notifications`);

export const deleteNotification = (notificationId: string) => api.delete(`/notifications/${notificationId}`);

export const markNotificationAsRead = ({ notificationId, type, entityId }: { notificationId?: string; type?: "single" | "all", entityId?: string }) => api.patch(`/notifications/mark-read`, { notificationId, type, entityId });