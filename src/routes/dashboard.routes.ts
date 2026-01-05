import express from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/stats', requireAuth, DashboardController.getStats);

export default router;
