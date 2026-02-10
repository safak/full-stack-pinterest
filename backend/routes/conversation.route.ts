import { Router } from 'express';
import {
  getAllConversations,
  getConversationById,
  getConversationByUserId,
  markMessagesAsRead,
  sendMessage
} from '../controllers/conversation.controller.ts';
import verifyToken from '../middleware/verifyToken.ts';

const router = Router();

// Create a new message
router.post('/', verifyToken, sendMessage);

// Get conversation by id (optionally support query params for pagination/filtering)
router.get('/:conversationId', verifyToken, getConversationById);

router.get('/participants/:userId', verifyToken, getConversationByUserId);

router.get('/', verifyToken, getAllConversations)

router.put('/mark-read/:conversationId', verifyToken, markMessagesAsRead);



export default router;