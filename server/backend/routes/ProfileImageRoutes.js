import express from 'express';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import crypto from 'crypto';
import path from 'path';
import {
  uploadProfileImage,
  getProfileImage,
  deleteProfileImage,
  updateProfileImageMetadata,
  getImagesByMunicipality
} from '../controllers/profileImageController.js';

const router = express.Router();

// Set up Multer with GridFsStorage
const storage = new GridFsStorage({
    url: process.env.MONGODB_URI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'profileImages',
            metadata: req.body // Attach metadata from the request body if needed
          };
          resolve(fileInfo);
        });
      });
    }
  });

const upload = multer({ storage });

// Routes
router.post('/upload', upload.single('file'), uploadProfileImage);
router.get('/municipality/:municipality', getImagesByMunicipality); // Updated to use controller function
router.delete('/:filename', deleteProfileImage);
router.put('/metadata/:filename', updateProfileImageMetadata);

export default router;
