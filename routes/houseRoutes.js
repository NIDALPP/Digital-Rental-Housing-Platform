import express from 'express';
import {
    createHouse,
    getAllHouses,
    getHouseById,
    updateHouse,
    deleteHouse
} from '../controllers/houseController.js';

import { protect, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllHouses);
router.get('/:id', getHouseById);

router.post('/', createHouse);
router.put('/:id', updateHouse);
router.delete('/:id', protect, authorizeAdmin, deleteHouse);

router.post('/search',getAllHouses)

export default router;
