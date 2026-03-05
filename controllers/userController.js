import User from '../models/User.js';
import { validationResult } from 'express-validator';

// @desc    Get all users
// @route   GET /api/users
// @access  Public
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json({
            status: 1,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.json({
            status: 0,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Public
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.json({
                status: 0,
                message: 'User not found'
            });
        }

        res.json({
            status: 1,
            data: user
        });
    } catch (error) {
        res.json({
            status: 0,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Create new user
// @route   POST /api/users
// @access  Public
export const createUser = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({
            status: 0,
            errors: errors.array()
        });
    }

    try {
        const user = await User.create(req.body);

        res.json({
            status: 1,
            message: 'User created successfully',
            data: user
        });
    } catch (error) {
        // Handle duplicate email error
        if (error.code === 11000) {
            return res.json({
                status: 0,
                message: 'Email already exists'
            });
        }

        res.json({
            status: 0,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Public
export const updateUser = async (req, res) => {
    try {
        const targetUserId = req.user?.isAdmin && req.body.userId
            ? req.body.userId
            : req.user?._id;

        

        if (!targetUserId) {
            return res.status(400).json({
                status: 0,
                message: 'User id is required'
            });
        }

        const payload = { ...req.body };
        delete payload.userId;
        delete payload.password;
        delete payload.isAdmin;

        const user = await User.findByIdAndUpdate(targetUserId, payload, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({
                status: 0,
                message: 'User not found'
            });
        }

        res.json({
            status: 1,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        // Handle duplicate email error
        if (error.code === 11000) {
            return res.json({
                status: 0,
                message: 'Email already exists'
            });
        }

        res.json({
            status: 0,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Public
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.json({
                status: 0,
                message: 'User not found'
            });
        }

        res.json({
            status: 1,
            message: 'User deleted successfully',
            data: {}
        });
    } catch (error) {
        res.json({
            status: 0,
            message: 'Server Error',
            error: error.message
        });
    }
};
