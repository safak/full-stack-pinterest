import { Schema } from "mongoose";
import mongoose from "mongoose";

const messageSchema = new Schema({
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
  content: {
    type: String,
    required: true,
  },
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
},
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);