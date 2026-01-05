import express from 'express';
import { AvailabilityController } from '../controllers/availability.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', AvailabilityController.getRange);
router.post('/bulk', requireAuth, AvailabilityController.bulkUpdate);
router.put('/', requireAuth, AvailabilityController.update); // Single update

export default router;
