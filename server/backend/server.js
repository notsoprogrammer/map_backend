import Grid from 'gridfs-stream';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fileUploadRoutes from './routes/fileUploadRoutes.js';
import mapRoutes from './routes/mapRoutes.js';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import profileImageRoutes from './routes/ProfileImageRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Connect to the database
connectDB(app);

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for parsing cookies
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Assuming your frontend is running on port 3000
  credentials: true, // Allow cookies to be sent with requests
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(bodyParser.json());

// Define routes
app.use('/api/users', userRoutes);
app.use('/api/get', mapRoutes);
app.use('/api/files', fileUploadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/image', profileImageRoutes);
// Root route

app.get('/', (req, res) => res.send('Server is ready'));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));
