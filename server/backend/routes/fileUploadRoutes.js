// routes/fileRoutes.js

import { upload, uploadFile } from '../controllers/fileUploadController.js';

import express from 'express';

const router = express.Router();



// Upload a file
router.post('/upload/:municipality/:mapType/:dataType/:latLong/:SWlatLong/:NElatLong', upload.single('file'), uploadFile);

export default router;
