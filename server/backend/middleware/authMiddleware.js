import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import Token from '../models/tokenModel.js';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
    console.log('Authorization Header:', req.headers.authorization); // Log the authorization header

    let authToken;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            authToken = req.headers.authorization.split(' ')[1];

            if (!authToken) {
                res.status(401).json({ message: 'Not authorized, no token' });
                return; // Exit the middleware to prevent further processing
            }

            const storedToken = await Token.findOne({ token: authToken });
            if (!storedToken) {
                res.status(401).json({ message: 'Not authorized, token not found' });
                return; // Exit the middleware to prevent further processing
            }

            const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');

            if (!req.user) {
                res.status(401).json({ message: 'Not authorized, user not found' });
                return; // Exit the middleware to prevent further processing
            }

            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            if (!res.headersSent) {
                res.status(401).json({ message: 'Not authorized, token verification failed' });
            }
        }
    } else {
        if (!res.headersSent) {
            res.status(401).json({ message: 'Not authorized, no token' });
        }
    }
});

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

export { protect, admin };
