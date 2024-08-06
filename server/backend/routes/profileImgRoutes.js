// // routes/profileImgRouter.js
import express from 'express';
import upload,{uploadUserProfileImage } from '../controllers/profileImgController';
// import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/profile/image',upload.single('file'), uploadUserProfileImage);

export default router;
