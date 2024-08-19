import {forgotPassword,resetPassword,getEmail} from '../controllers/forgotPasswordController.js';
import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword); 
router.post('/get-email', getEmail); 
router.get('/validate-token', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      res.status(200).json({ valid: true });
    } catch (error) {
      res.status(401).json({ valid: false, message: 'Token expired or invalid' });
    }
  });
export default router;