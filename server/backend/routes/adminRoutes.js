import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { addUser, deleteUser } from '../controllers/adminController.js';

const router = express.Router();

// Route for adding a user
router.post('/adduser', protect, admin, addUser);

// Route for deleting a user
router.delete('/deleteuser/:id', protect, admin, deleteUser);

export default router;
