// profileImageRoutes.js
import express from 'express';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import crypto from 'crypto';
import path from 'path';
import {
  uploadProfileImage,
  getProfileImage,
  deleteProfileImage,
  updateProfileImageMetadata
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

// Route to handle file upload
router.post('/upload', upload.single('file'), uploadProfileImage);

// Route to retrieve a file by filename
router.get('/:filename', getProfileImage);

// Route to delete a file by filename
router.delete('/:filename', deleteProfileImage);

// Route to update metadata of a file
router.put('/metadata/:filename', updateProfileImageMetadata);

export default router;
