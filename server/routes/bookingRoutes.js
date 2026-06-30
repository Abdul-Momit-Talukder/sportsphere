import express from 'express';
import {
  getBookings,
  getBookingById,
  getAvailableSlots,
  createBooking,
  updateBooking,
  deleteBooking,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/slots', getAvailableSlots);
router.get('/', protect, getBookings);
router.get('/:id', protect, getBookingById);
router.post('/', protect, createBooking);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, deleteBooking);

export default router;
