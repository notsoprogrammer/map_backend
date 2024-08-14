import {forgotPassword,resetPassword,getEmail} from '../controllers/forgotPasswordController.js';
import express from 'express';

const router = express.Router();

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword); 
router.post('/get-email', getEmail); 
export default router;