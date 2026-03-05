import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes
export const protect = async (req, res, next) => {
    let token;

    // Check if token exists in Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Extract token from "Bearer TOKEN"
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        return res.status(401).json({
            status: 0,
            message: 'Not authorized to access this route'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request object
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                status: 0,
                message: 'User not found for this token'
            });
        }

        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            status: 0,
            message: 'Not authorized to access this route'
        });
    }
};

// Authorize Admin (check role)
export const authorizeAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({
            status: 0,
            message: 'Admin only access'
        });

        // if (!req.user) {
        //     return res.json({ message: "User not found" });
        // }

    }
    next();
};
