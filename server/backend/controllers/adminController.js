import asyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer';
import User from '../models/userModel.js';

// Helper function to generate a random 6-character password
const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-6); 
};

// Handle adding a new user
const addUser = asyncHandler(async (req, res) => {
    const { name, email, municipality, job, role } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    // Generate a random 6-character password
    const randomPassword = generateRandomPassword();


    // Create a new user
    const user = new User({ 
        name, 
        email, 
        password: randomPassword,
        municipality, 
        job, 
        role 
    });

    await user.save();

    // Send email with credentials
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASS,
        },
    });

    const message = `
    Hi ${name}!

    Welcome to Mapulon App! We're thrilled to have you on board as part of our growing users. 
    Your account has been successfully created, and you're now ready to explore and contribute to our platform.

    Here are your login details:
    
    📧 Email: ${email}
    🔑 Temporary Password: ${randomPassword}

    You can log in to the application here: https://mapulon.netlify.app

    For your security, we recommend logging in and updating your password right away. 

    You will also receive a **separate email from Tableau** with instructions on how to set up your Tableau account and activate the software.

    We're excited to see how you'll make the most of the tools and features we have created to enhance agricultural productivity. If you have any questions, don't hesitate to reach out – we're here to help!

    Thank you for joining us on this important journey towards smarter farming and better resource management.

    Best regards,
    The Project GeoMap Team
    🌱 Mapping the Future of Agriculture 
`;


    const mailOptions = {
        from: process.env.SMTP_MAIL, // Your app's email address
        to: email,
        subject: 'Your account has been created',
        text: message,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(201).json({ message: 'User added successfully and email sent.', user });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'User created but email could not be sent.' });
    }
});


// Handle deleting a user
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.remove();
        res.json({ message: 'User removed successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

export { addUser, deleteUser };
