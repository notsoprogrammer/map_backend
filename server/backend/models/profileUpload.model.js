// // models/profileUpload.model.js
import mongoose from 'mongoose';

const profileImageSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    imageUrl: String,  // URL or reference to the image stored in GridFS
    uploadDate: { type: Date, default: Date.now }
});

const ProfileImage = mongoose.model('ProfileImage', profileImageSchema);

export default ProfileImage;
