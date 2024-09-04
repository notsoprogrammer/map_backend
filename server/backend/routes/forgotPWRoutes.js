import {forgotPassword,resetPassword,getEmail,tableauAuth,tableauCallback,tableauSession} from '../controllers/forgotPasswordController.js';
import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword); 
router.post('/get-email', getEmail); 
router.get('/tableau', tableauAuth);
router.get('/tableau/callback', tableauCallback);
router.get('/tableau/session', tableauSession);
router.get('/validate-token', (req, res) => {
    const authToken = req.headers.authorization.split(' ')[1];
    
    try {
      jwt.verify(authToken, process.env.JWT_SECRET);
      res.status(200).json({ valid: true });
    } catch (error) {
      res.status(401).json({ valid: false, message: 'Token expired or invalid' });
    }
  });
export default router;