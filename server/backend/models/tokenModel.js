import mongoose from 'mongoose';

// Updated token schema to store both authToken and tableauToken
const tokenSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  authToken: { 
    type: String,
    required: true,
  },
  tableauToken: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 30 * 24 * 60 * 60, // 30 days
  },
});

const Token = mongoose.model('Token', tokenSchema);

export default Token;
