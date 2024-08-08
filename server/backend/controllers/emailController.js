import nodemailer from 'nodemailer';

// Setting up the transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email send function
const sendEmail = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, message } = req.body;

  const mailOptions = {
    from: email,  // Use the email from the form
    to: 'webapp.sigisdac@gmail.com',  // Target email address
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
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email: ', error);
    res.status(500).send('Error sending email');
  }
};

export { sendEmail };
