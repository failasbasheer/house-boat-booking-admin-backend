import express from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', getSettings); // Public read? Or protected? Usually contact info is public.
router.put('/', requireAuth, updateSettings); // Protected update

export default router;
