
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

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

        user.password = await bcrypt.hash(password, 10);
        user.resetToken = undefined;
        user.resetTokenExpire = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful.' });
    } catch (error) {
        res.status(400).json({ message: 'Failed to reset password.' });
    }
};
