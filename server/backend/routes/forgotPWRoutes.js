import {forgotPassword} from '../controllers/forgotPasswordController.js';
import express from 'express';

const router = express.Router();

router.post('/forgot-password', forgotPassword);

export default router;