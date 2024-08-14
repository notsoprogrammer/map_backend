import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/userModel.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        // Respond with a generic message to avoid email enumeration attacks
        return res.status(200).json({ message: 'A link to reset your password has been sent if the email is registered with us.' });
    }

    // Check for excessive attempts
    const now = new Date();
    if (user.lastResetAttempt && (now - user.lastResetAttempt < 24 * 60 * 60 * 1000)) {
        if (user.resetAttempts >= 20) {
            return res.status(429).json({ message: 'Maximum reset attempts exceeded. Please try again tomorrow.' });
        }
    } else {
        user.resetAttempts = 0;  // Reset the count after a day
    }

    user.resetAttempts++;
    user.lastResetAttempt = now;
    await user.save();

    // Generate a reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    user.resetToken = resetToken;
    user.resetTokenExpire = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour expiration
    await user.save();

    // Create the reset URL and email it to the user
    const resetUrl = `${process.env.REACT_FRONTEND}/reset-password/${resetToken}`;
    const message = `You are receiving this because you (or someone else) requested a reset of your account password.\n\n
                     Please click on the following link, or paste it into your browser to complete the process:\n\n
                     ${resetUrl}\n\n
                     If you did not request this, please ignore this email and your password will remain unchanged.`;

    const transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
            user: process.env.SENDGRID_USERNAME,
            pass: process.env.SENDGRID_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: 'Password Reset Request',
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Failed to send reset email:', error);
            return res.status(500).json({ message: 'Email could not be sent.', error: error.message });
        }
        res.status(200).json({ message: 'Reset link sent to email.' });
    });
};

export const resetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(400).json({ message: 'Invalid token or user does not exist.' });
        }

        if (user.resetToken !== token || user.resetTokenExpire < Date.now()) {
            return res.status(400).json({ message: 'Token expired or invalid.' });
        }

        // Update the password; the pre-save hook will hash it
        user.password = password;

        // Clear reset token fields
        user.resetToken = undefined;
        user.resetTokenExpire = undefined;

        // Save the updated user
        await user.save();

        res.status(200).json({ message: 'Password reset successful. Please log in with your new password.' });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(400).json({ message: 'Failed to reset password.' });
    }
};


