import express from 'express';
import { ContentController } from '../controllers/content.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/faqs', ContentController.getFAQs);
router.post('/faqs/seed', requireAuth, ContentController.seedFAQs);

router.get('/pricing', ContentController.getPricing);
router.post('/pricing/seed', requireAuth, ContentController.seedPricing);

export default router;
