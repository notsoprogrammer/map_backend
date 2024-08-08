import express from 'express';
import { sendEmail } from '../controllers/emailController.js';

const router = express.Router();

// Route to handle sending emails
router.post('/send', sendEmail);

export default router;
