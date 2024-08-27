import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import Token from '../models/tokenModel.js';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
    console.log('Authorization Header:', req.headers.authorization); // Log the authorization header

    let authtoken;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            authtoken = req.headers.authorization.split(' ')[1];

            if (!authtoken) {
                res.redirect(`${process.env.REACT_APP_API_URL}/api/users/logout`);
                throw new Error('Not authorized, no token');
            }

            const storedToken = await Token.findOne({ authtoken });
            if (!storedToken) {
                res.redirect(`${process.env.REACT_APP_API_URL}/api/users/logout`);
                throw new Error('Not authorized, token not found');
            }

            const decoded = jwt.verify(authtoken, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');

            if (!req.user) {
                res.redirect(`${process.env.REACT_APP_API_URL}/api/users/logout`);
                throw new Error('Not authorized, user not found');
            }

            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            res.redirect(`${process.env.REACT_APP_API_URL}/api/users/logout`);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.redirect(`${process.env.REACT_APP_API_URL}/api/users/logout`);
        throw new Error('Not authorized, no token');
    }
});

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as an admin');
    }
};

export { protect, admin };
