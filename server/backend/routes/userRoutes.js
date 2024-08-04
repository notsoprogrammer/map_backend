import { authUser, logoutUser, registerUser, updateUserProfile, userProfile } from '../controllers/userController.js';

import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.route('/profile').get(protect, userProfile).put(protect, updateUserProfile);

export default router;