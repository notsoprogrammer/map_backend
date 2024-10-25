import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { addUser, deleteUser } from '../controllers/adminController.js';

const router = express.Router();


router.post('/adduser', protect, admin, addUser);


router.delete('/deleteuser/:id', protect, admin, deleteUser);

export default router;
