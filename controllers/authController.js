import User from '../models/User.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password, age, phone, address } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.json({
                status: 0,
                message: 'User already exists with this email'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            age,
            phone,
            address
            // isAdmin
        });

        // Send token response
        sendTokenResponse(user, res, 'User registered successfully');
    } catch (error) {
        res.json({
            status: 0,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.json({
                status: 0,
                message: 'Please provide an email and password'
            });
        }

        // Check for user (include password field)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.json({
                status: 0,
                message: 'Invalid credentials'
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.json({
                status: 0,
                message: 'Invalid credentials'
            });
        }

        // Send token response
        sendTokenResponse(user, res, 'Login successful');
    } catch (error) {
        res.json({
            status: 0,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

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

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, res, message) => {
    // Create token
    const token = user.getSignedJwtToken();

    // Remove password from output
    user.password = undefined;

    res.json({
        status: 1,
        message,
        token,
    });
};

// @desc    Admin login
// @route   POST /api/auth/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.json({
                status: 0,
                message: 'Please provide an email and password'
            });
        }

        // Check for user (include password field)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.json({
                status: 0,
                message: 'Invalid credentials'
            });
        }

        // Check if user is admin
        if (!user.isAdmin) {
            return res.json({
                status: 0,
                message: 'Not authorized as admin'
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.json({
                status: 0,
                message: 'Invalid credentials'
            });
        }

        // Send token response
        sendTokenResponse(user, res, 'Admin login successful');
    } catch (error) {
        res.json({
            status: 0,
            message: 'Server Error',
            error: error.message
        });
    }
};
