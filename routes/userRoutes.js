import express from 'express';
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/userController.js';
import { userValidationRules } from '../middleware/validation.js';
import { protect, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public route - CREATE new user (no authentication required)
router.post('/register', userValidationRules, createUser);

// Protect all remaining routes
router.use(protect);

// GET all users (protected)
router.get('/user-list', authorizeAdmin, getUsers);
router.get('/user-details', getUserById);
router.post('/update-details', protect, updateUser);
router.delete('/delete-details', authorizeAdmin, deleteUser);



export default router;
