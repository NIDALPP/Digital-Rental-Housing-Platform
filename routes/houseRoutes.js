import express from 'express';
import {
    createHouse,
    getAllHouses,
    getHousesByRole,
    getApprovedHouses,
    getHouseById,
    updateHouse,
    deleteHouse
} from '../controllers/houseController.js';
import { houseValidationRules } from '../middleware/validation.js';

import { protect, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/add', protect,houseValidationRules, createHouse);

router.get('/', getApprovedHouses);
router.get('/list', protect, getHousesByRole);
router.get('/admin', protect, authorizeAdmin, getAllHouses);
router.get('/:id',protect, getHouseById);



router.put('/:id', protect, updateHouse);
router.delete('/:id', protect, authorizeAdmin, deleteHouse);




router.post('/search', getAllHouses)

export default router;
