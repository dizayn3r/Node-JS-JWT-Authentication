import express from 'express';
import AuthController from '../controllers/auth_controller.js';
const router = express.Router();

// Public routes
router.post('/refreshToken', AuthController.refreshToken)

// Protected routes


export default router