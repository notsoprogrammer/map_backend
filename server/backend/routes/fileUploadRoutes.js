
import { protect,admin } from '../middleware/authMiddleware.js';
import { upload, uploadFile } from '../controllers/fileUploadController.js';

import express from 'express';

const router = express.Router();




router.post('/upload/:municipality/:mapType/:dataType/:latLong/:SWlatLong/:NElatLong',  protect, admin, upload.single('file'), uploadFile);

export default router;
