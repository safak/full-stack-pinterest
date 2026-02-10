import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: [
      "PIN_LIKE",
      "COMMENT",
      "COMMENT_LIKE",
      "COMMENT_REPLY",
      "FOLLOW",
      "MESSAGE",
    ],
    required: true,
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, // pinId / commentId / userId / messageId
  },
  entityType: {
    type: String,
    enum: ["Pin", "Comment", "User", "Message"],
    required: true,
  },
  message: {
    type: String,
    required: true, // UI me show hone wala text
  },
  isRead: {
    type: Boolean,
    default: false,
  },
},
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);