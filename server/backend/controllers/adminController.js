import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// Handle adding a new user
const addUser = asyncHandler(async (req, res) => {
    const { name, email, password, municipality, job, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = new User({ name, email, password, municipality, job, role });

    await user.save();

    res.status(201).json({ message: 'User added successfully', user });
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
