import express from 'express';
import { getUserProfile, getAllUsers } from '../controllers/userController.js';
const router = express.Router();

router.get('/:userId', getUserProfile);
router.get('/', getAllUsers);

export default router;
