import express from 'express';
import multer from 'multer';
import {
  getVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
  getAllVenuesAdmin,
} from '../controllers/venueController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', getVenues);
router.get('/admin/all', protect, admin, getAllVenuesAdmin);
router.get('/:id', getVenueById);
router.post('/', protect, admin, upload.single('image'), createVenue);
router.put('/:id', protect, admin, upload.single('image'), updateVenue);
router.delete('/:id', protect, admin, deleteVenue);

export default router;
