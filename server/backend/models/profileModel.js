import mongoose from 'mongoose';

const profileImageSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  uploadDate: { type: Date, default: Date.now },
  municipality: {
    type: String,
    required: true
  }
});

const ProfileImage = mongoose.model('ProfileImage', profileImageSchema, 'profileImages');
export default ProfileImage;
