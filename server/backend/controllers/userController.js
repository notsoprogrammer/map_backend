import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';
import Token from '../models/tokenModel.js';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

//@desc Auth user/set token
//route POST /api/users/auth
//@access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPasswords(password))) {
    // Generate the authentication token
    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d', // or any duration you prefer
    });

    // Generate the Tableau-specific JWT
    const tableauToken = jwt.sign(
      {
        iss: process.env.CONNECTED_APP_CLIENT_ID, // Connected App Client ID
        exp: moment().utc().add(5, 'minutes').unix(),
        jti: uuidv4(),
        aud: 'tableau',
        sub: user.email, // The Tableau Cloud user email
        scp: ["tableau:views:embed"]},
      process.env.CONNECTED_APP_SECRET_KEY,
      {
        algorithm: 'HS256',
        header: {
          kid: process.env.CONNECTED_APP_SECRET_ID,
          iss: process.env.CONNECTED_APP_CLIENT_ID
        }
      }
    );

    // Store both tokens in the database
    await Token.create({
      userId: user._id,
      token: authToken,
      tableauToken: tableauToken,
    });

    // Respond with the tokens and user details
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      municipality: user.municipality,
      job: user.job,
      role: user.role,
      authToken, // Authentication token
      tableauToken, // Tableau-specific token
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

//@desc Register new user
//route POST /api/users
//@access Public
const registerUser = asyncHandler( async (req, res) => {
  const { name, email, password, municipality, job, role } = req.body;

  try {
      const userExists = await User.findOne({ email });

      if(userExists) {
          res.status(400);
          throw new Error('User already exists');
      }

      const user = await User.create({
          name,
          email,
          password,
          municipality,
          job,
          role
      });

      if(user) {
          res.status(201).json({
              _id: user._id,
              name: user.name,
              email: user.email,
              municipality: user.municipality,
              job: user.job,
              role: user.role,
          });
      } else {
          res.status(400);
          throw new Error('Invalid user data');
      }
  } catch (error) {
      console.error('Error during user registration:', error.message);
      res.status(500).json({ message: 'Server error during user registration' });
  }
});


//@desc Logout user
//route POST /api/users/logout
//@access Public

const logoutUser = asyncHandler(async (req, res) => {

    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({ message: 'User logged out successfully' });
});

//@desc Get user profile
//route GET /api/users/profile
//@access Private
const userProfile = asyncHandler( async (req, res) => {
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        municipality: req.user.municipality,
        job: req.user.job,
        role: req.user.role,
    };
    res.status(200).json(user);
});

//@desc Update user profile
//route PUT /api/users/profile
//@access Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.job = req.body.job || user.job;
        user.municipality = req.body.municipality || user.municipality;
        // user.profileImg = req.body.profileImg || user.profileImg;

        if (req.body.password) {
            user.password = req.body.password;  // Ensure this password is hashed (usually handled in your User model)
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            municipality: updatedUser.municipality,
            job: updatedUser.job,
            // profileImg: updatedUser.profileImg
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});


export { 
    authUser, 
    registerUser, 
    logoutUser, 
    userProfile, 
    updateUserProfile 
};