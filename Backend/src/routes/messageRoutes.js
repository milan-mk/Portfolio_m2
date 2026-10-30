import { Router } from 'express';
import {
  createMessage,
  deleteMessage,
  getMessageById,
  getMessages,
  updateMessageStatus,
} from '../controllers/messageController.js';

const router = Router();

router.route('/')
  .post(createMessage)
  .get(getMessages);

router.route('/:id')
  .get(getMessageById)
  .delete(deleteMessage);

router.route('/:id/status')
  .patch(updateMessageStatus);

export default router;
