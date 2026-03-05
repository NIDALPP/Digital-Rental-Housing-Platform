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

import { protect, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();


router.get('/', getApprovedHouses);
router.get('/list', protect, getHousesByRole);
router.get('/admin', protect, authorizeAdmin, getAllHouses);
router.get('/:id', getHouseById);

router.post('/', protect, createHouse);
router.put('/:id', protect, authorizeAdmin, updateHouse);
router.delete('/:id', protect, authorizeAdmin, deleteHouse);




router.post('/search', getAllHouses)

export default router;
