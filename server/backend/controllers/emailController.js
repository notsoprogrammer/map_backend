import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async (req, res) => {
    const { firstName, lastName, email, phoneNumber, message } = req.body;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,  // true if port is 465, false for other ports like 587
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: 'Thank you for contacting us!',
      text: `Dear ${firstName} ${lastName},

Thank you for reaching out to us! We have received your message and will be in touch shortly.

Here are the details we received:
- First Name: ${firstName}
- Last Name: ${lastName}
- Email: ${email}
- Phone Number: ${phoneNumber}
- Message: ${message}

If any of this information is incorrect, please let us know.

Best regards,
Project Geomap`
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);  // Log successful email sending
      res.status(200).json({ message: 'Email sent successfully, thank you for your message!' });
    } catch (error) {
      console.error('Error sending email:', error);  // Log the error details
      res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
};

export { sendEmail };
