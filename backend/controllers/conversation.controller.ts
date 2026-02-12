import Message from "../models/message.model.ts";
import Conversation from "../models/conversation.model.ts";
import { createNotificationService } from "../services/notificationService.ts";

export const sendMessage = async (req: any, res: any) => {
  const io = req.app.get("io");
  const userId = req.userId
  const { conversationId, receiver, content } = req.body;
  if (!receiver || !content) {
    return res.status(400).json({ message: "Receiver and content are required." })
  }

  // Ensure we have a conversation to attach the message to. If none exists, create one.
  let conversation = null;
  let convId = conversationId;
  if (convId) {
    conversation = await Conversation.findById(convId);
  }

  if (!conversation) {
    const newConversation = new Conversation({
      participants: [userId, receiver],
      messages: [],
    });
    await newConversation.save();
    conversation = newConversation;
    convId = newConversation._id;
  }

  // Create a single message with a guaranteed conversation id
  const newMessage = new Message({ conversationId: convId, sender: userId, receiver, content });
  await newMessage.save();

  // Update the conversation with the new message
  await Conversation.findByIdAndUpdate(convId, {
    $push: { messages: newMessage._id },
    lastMessage: newMessage._id,
  });

  const notificationPayload = {
    sender: userId,
    receiver: receiver,
    type: "MESSAGE",
    entityId: newMessage._id,
    entityType: "Message",
    message: `You have a new message.`,
  };
  await createNotificationService(notificationPayload);

  // Emit the new message to the conversation room and to each participant's personal room
  // (server joins sockets to rooms named by userId on connection). This ensures
  // recipients receive the event whether or not they've joined the conversation room.
  io.to(convId.toString()).to(receiver.toString()).to(userId.toString()).emit("newMessage", newMessage);
  res.status(201).json({ message: "Message sent!", data: newMessage });
};

export const getConversationById = async (req: any, res: any) => {
  try {
    const { conversationId } = req.params;
    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is required." });
    }
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit as string) || 20, 1);
    const skip = (page - 1) * limit;

    // Fetch newest messages first (descending), then reverse so client receives
    // the page in chronological order (oldest -> newest) while still paginating
    // from the end of the message list.
    const [total, messagesDesc] = await Promise.all([
      Message.countDocuments({ conversationId }),
      Message.find({ conversationId })
        .sort({ createdAt: -1 })
        // .skip(skip)
        // .limit(limit),
    ])

    const totalPages = Math.ceil(total / limit) || 1;

    const messages = (messagesDesc || []).reverse();

    res.status(200).json({
      message: "Messages retrieved successfully",
      data: messages,
      previousCursor: page > 1 ? page - 1 : null,
      meta: { page, limit, total, totalPages },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to retrieve messages" });
  }
};

export const getAllConversations = async (req: any, res: any) => {
  try {
    const userId = req.userId;
    const conversations = await Conversation.find({
      participants: userId,
    })
      .sort({ updatedAt: -1 })
      .populate({ path: "participants", select: "_id username displayName img" })
      .populate({
        path: "lastMessage",
      });
    res.status(200).json({ message: "Conversations retrieved successfully", data: conversations });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to retrieve conversations" });
  }
};

export const getConversationByUserId = async (req: any, res: any) => {
  try {
    const userId = req.userId;
    const otherUserId = req.params.userId;
    if (!otherUserId) {
      return res.status(400).json({ message: "Receiver ID is required." });
    }
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    }).populate("lastMessage participants", "_id username displayName img");

    if (!conversation) {
      return res.status(200).json({ message: "Conversation did not start between the specified users." });
    }

    res.status(200).json({ message: "Conversation retrieved successfully", data: conversation });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to retrieve conversation" });
  }
};

export const markMessagesAsRead = async (req: any, res: any) => {
  try {
    const userId = req.userId;
    const { conversationId } = req.params;
    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID is required." });
    }
    await Message.updateMany(
      { conversationId, receiver: userId, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({ message: "Messages marked as read" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to mark messages as read" });
  }
};