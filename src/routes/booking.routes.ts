import express from 'express';
import { BookingController } from '../controllers/booking.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = express.Router();

// Public (or protected if internal) - Assuming internal dashboard usage mainly, 
// but creation might be public in future. For now, authenticated for management.
router.get('/', requireAuth, BookingController.getAll);
router.get('/:id', requireAuth, BookingController.getOne);
router.post('/', requireAuth, BookingController.create); // Manager creating booking
router.put('/:id', requireAuth, BookingController.update);
router.post('/:id/assign', requireAuth, BookingController.assignBoat);

export default router;
