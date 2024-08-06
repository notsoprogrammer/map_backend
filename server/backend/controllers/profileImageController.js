import Grid from 'gridfs-stream';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('profileImages');
});

// Upload a profile image
const uploadProfileImage = async (req, res) => {
    if (req.file) {
        res.status(201).json({
            message: "File uploaded successfully",
            fileDetails: {
                filename: req.file.filename,
                fileId: req.file.id,
                metadata: req.file.metadata
            }
        });
    } else {
        res.status(400).send("No file uploaded");
    }
};

// Get a profile image by filename
const getProfileImage = async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });
        if (!file) {
            return res.status(404).send("No file exists");
        }
        
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
    } catch (error) {
        res.status(500).send("Error retrieving file: " + error.message);
    }
};

// Delete a profile image
const deleteProfileImage = async (req, res) => {
    try {
        await gfs.files.deleteOne({ filename: req.params.filename });
        res.status(200).send("File deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting file: " + error.message);
    }
};

// Update the metadata of a profile image
const updateProfileImageMetadata = async (req, res) => {
    const { filename } = req.params;
    const { newMetadata } = req.body;

    try {
        const file = await gfs.files.findOne({ filename: filename });
        if (!file) {
            return res.status(404).send("No file exists");
        }

        await gfs.files.updateOne({ filename: filename }, { $set: { "metadata": newMetadata } });
        res.status(200).json({
            message: "Metadata updated successfully",
            metadata: newMetadata
        });
    } catch (error) {
        res.status(500).send("Error updating metadata: " + error.message);
    }
};

export { uploadProfileImage, getProfileImage, deleteProfileImage, updateProfileImageMetadata}
