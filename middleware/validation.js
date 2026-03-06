import { body } from 'express-validator';

export const userValidationRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('age').optional().isInt({ min: 0, max: 120 }).withMessage('Age must be between 0 and 120'),
    body('phone').optional(),
    body('address.street').optional(),
    body('address.city').optional(),
    body('address.state').optional(),
    body('address.zipCode').optional(),
    body('address.country').optional(),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];



export const houseValidationRules = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional(),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('type').optional(),
    body('bedrooms').isInt({ min: 0 }).withMessage('Rooms must be a non-negative integer'),
    body('bathrooms').isInt({ min: 0 }).withMessage('Bathrooms must be a non-negative integer'),
    body('isFurnished').optional().isBoolean().withMessage('isFurnished must be a boolean'),
    body('address.street').optional(),
    body('address.city').optional(),
    body('address.state').optional(),
    body('address.zipCode').optional(),
    body('address.country').optional(),
    body('images').optional().isArray().withMessage('Images must be an array'),
    body('thumbnail').optional(),
    body('sqft').optional().isNumeric().withMessage('Square footage must be a number'),
    body('amenities').optional().isArray().withMessage('Amenities must be an array')
];

