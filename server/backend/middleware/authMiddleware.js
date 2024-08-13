// import jwt from 'jsonwebtoken';
// import asyncHandler from 'express-async-handler';
// import User from '../models/userModel.js';

// const protect = asyncHandler(async (req, res, next) => {
//   let token;

//   if (req.cookies.jwt) {
//     try {
//       token = req.cookies.jwt;
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = await User.findById(decoded.userId).select('-password');

//       if (!req.user) {
//         res.status(401);
//         throw new Error('Not authorized, user not found');
//       }

//       console.log('User authenticated:', req.user); // Debugging log

//       next();
//     } catch (error) {
//       console.error('Token verification failed:', error); // Debugging log
//       res.status(401);
//       throw new Error('Not authorized, token failed');
//     }
//   } else {
//     console.error('No token found in cookies'); // Debugging log
//     res.status(401);
//     throw new Error('Not authorized, no token');
//   }
// });

// export { protect };


import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import Token from '../models/tokenModel.js';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Check if the token exists in the database
            const storedToken = await Token.findOne({ token });
            if (!storedToken) {
                res.status(401);
                throw new Error('Not authorized, token failed');
            }

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the user to the request object
            req.user = await User.findById(decoded.userId).select('-password');

            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

export { protect };
