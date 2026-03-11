import express from 'express'; 
import { getChatHistory, getUserChats, deleteChatHistory } from '../controllers/messageController.js';

const router = express.Router();
router.get('/:userId1/:userId2', getChatHistory);
router.get('/inbox/:userId', getUserChats);
router.delete('/:userId1/:userId2',deleteChatHistory);
export default router;
