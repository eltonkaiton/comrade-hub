import express from 'express';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  createHouse,
  getHouses,
  getHouseById,
  getMyHouses,
  updateHouse,
  deleteHouse,
} from '../controllers/houseController.js';

const router = express.Router();

// Public
router.get('/', getHouses);

// Private (must be before /:id so "mine" isn't treated as an id)
router.get('/mine', protect, getMyHouses);

// Public dynamic route
router.get('/:id', getHouseById);

// Protected
router.post('/', protect, upload.array('images', 8), createHouse);
router.put('/:id', protect, upload.array('images', 8), updateHouse);
router.delete('/:id', protect, deleteHouse);

export default router;