export type NotificationType = {
  _id?: string
  sender: string;
  receiver: string;
  type: "PIN_LIKE" | "PIN_COMMENT" | "COMMENT_LIKE" | "COMMENT_REPLY" | "FOLLOW" | "MESSAGE";
  entityId: string;
  entityType: "Pin" | "Comment" | "User" | "Message";
  message: string;
  isRead: boolean;
  timestamp: string;
};

