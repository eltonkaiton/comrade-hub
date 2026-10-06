import express from 'express';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  createTransport,
  getTransports,
  getTransportById,
  getMyTransports,
  updateTransport,
  deleteTransport,
} from '../controllers/transportController.js';

const router = express.Router();

// Public
router.get('/', getTransports);

// Private — must be before /:id
router.get('/mine', protect, getMyTransports);

// Public dynamic
router.get('/:id', getTransportById);

// Protected
router.post('/', protect, upload.array('images', 8), createTransport);
router.put('/:id', protect, upload.array('images', 8), updateTransport);
router.delete('/:id', protect, deleteTransport);

export default router;