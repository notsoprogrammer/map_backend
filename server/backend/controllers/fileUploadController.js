// controllers/fileController.js

import Grid from 'gridfs-stream'
import { GridFsStorage } from 'multer-gridfs-storage';
import dotenv from 'dotenv';
import mongoose from 'mongoose'
import multer from 'multer'

dotenv.config();

// Create MongoDB connection and GridFS stream
// const mongoURI = 'mongodb+srv://admin:Q2GBPLSOm5HaMi0d@geomap.w0wdzg3.mongodb.net/Maps?retryWrites=true&w=majority';
const conn = mongoose.connection;
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('maps');
  console.log('GridFS Connected')
});

// Create storage engine using multer-gridfs-storage
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {

    const extent = [];
    const { municipality, mapType, dataType, latLong, SWlatLong, NElatLong } = req.params;
    extent.push(SWlatLong);
    extent.push(NElatLong);

    return {
      filename: file.originalname,
      bucketName: 'maps',
      metadata: {
        municipality,
        mapType,
        dataType,
        latLong,
        extent,
      },
    };
  },
});

const upload = multer({ storage });

// Upload a file
const uploadFile = async (req, res) => {
  // res.json({ file: req.file });
  try {
    res.json({ file: req.file, message: "File uploaded successfully" });
  } catch (error) {
    res.status(500).json({ error: 'Error saving file details' });
  }
};

export {
  upload,
  uploadFile,
};
