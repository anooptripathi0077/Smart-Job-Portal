import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Registration endpoint
router.post('/register', authController.register);

// Login endpoint
router.post('/login', authController.login);

router.put('/profile', authenticateJWT, authController.updateProfile);

// Protected profile endpoint
router.get('/profile', authenticateJWT, authController.getProfile);

export default router;
