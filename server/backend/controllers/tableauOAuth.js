// tableauController.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const handleTableauOAuth = async (req, res) => {
  const { code } = req.query;
  try {
    const clientId = process.env.TABLEAU_CLIENT_ID;
    const clientSecret = process.env.TABLEAU_CLIENT_SECRET;
    const redirectUri = process.env.TABLEAU_REDIRECT_URI;

    const tableauResponse = await axios.post('https://tableau.server.com/api/3.10/auth/signin', {
      auth: {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'    
      }
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const accessToken = tableauResponse.data.access_token;
    res.json({ token: accessToken });

  } catch (error) {
    console.error('Failed to exchange authorization code:', error);
    res.status(500).json({ message: 'Failed to authenticate with Tableau' });
  }
};
