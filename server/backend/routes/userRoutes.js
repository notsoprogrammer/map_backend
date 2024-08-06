import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authUser, logoutUser, registerUser, updateUserProfile, userProfile } from '../controllers/userController.js';
import upload,{ uploadUserProfileImage } from '../controllers/profileImgController';

const router = express.Router();

// User data routes
router.post('/', registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.route('/profile')
    .get(protect, userProfile)
    .put(protect, updateUserProfile);

// Separate route for profile image upload
 router.post('/profile', protect, upload.single('profileImg'), uploadUserProfileImage);

export default router;
