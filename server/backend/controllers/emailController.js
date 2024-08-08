import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async (req, res) => {
    const { firstName, lastName, email, phoneNumber, message } = req.body;
  
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,  // or true if using SSL on a specific port
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASS
      }
    });
  
    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: 'New Contact Form Submission',
      text: `You have a new contact form submission from:
        First Name: ${firstName}
        Last Name: ${lastName}
        Email: ${email}
        Phone Number: ${phoneNumber}
        Message: ${message}`
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
  };
  

export { sendEmail };
