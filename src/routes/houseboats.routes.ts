import { Router } from 'express';
import * as HouseboatController from '../controllers/houseboat.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Public Routes
router.get('/', HouseboatController.listHouseboats);
router.get('/:id', HouseboatController.getHouseboat);

// Protected Routes
router.use(requireAuth);
router.post('/', HouseboatController.createHouseboat);
router.put('/:id', HouseboatController.updateHouseboat);
router.delete('/:id', HouseboatController.deleteHouseboat);

export default router;