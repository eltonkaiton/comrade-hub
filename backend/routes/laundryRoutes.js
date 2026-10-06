import express from 'express';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  createLaundry,
  getLaundries,
  getLaundryById,
  getMyLaundries,
  updateLaundry,
  deleteLaundry,
} from '../controllers/laundryController.js';

const router = express.Router();

router.get('/', getLaundries);
router.get('/mine', protect, getMyLaundries);
router.get('/:id', getLaundryById);

router.post('/', protect, upload.array('images', 8), createLaundry);
router.put('/:id', protect, upload.array('images', 8), updateLaundry);
router.delete('/:id', protect, deleteLaundry);

export default router;