import express from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/generate-token', (req, res) => {
  try {
    const token = jwt.sign(
      {
        iss: process.env.CONNECTED_APP_CLIENT_ID,
        exp: moment().utc().add(10, 'minutes').unix(),
        jti: uuidv4(),
        aud: 'tableau',
        sub: process.env.USER_EMAIL,  // The email of the Tableau user
        scp: ["tableau:views:embed"]
      },
      process.env.CONNECTED_APP_SECRET_KEY,
      {
        algorithm: 'HS256',
        header: {
          kid: process.env.CONNECTED_APP_SECRET_ID,
        },
      }
    );

    res.json({ token });
  } catch (error) {
    console.error('Error generating Tableau JWT:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
