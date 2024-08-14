import {forgotPassword} from '../controllers/forgotPasswordController.js';
import { resetPassword } from '../controllers/resetController.js';
import express from 'express';

const router = express.Router();

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword); 
export default router;