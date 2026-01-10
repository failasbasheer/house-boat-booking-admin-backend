import express from 'express';
import { CategoryController } from '../controllers/category.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', CategoryController.getAll);
router.post('/', requireAuth, CategoryController.create);
router.put('/:id', requireAuth, CategoryController.update);
router.delete('/:id', requireAuth, CategoryController.delete);
router.post('/seed', requireAuth, CategoryController.seedDefaults); // Admin tool
router.post('/seed-packages', requireAuth, CategoryController.seedPackages); // Seed Packages
router.post('/sync-counts', requireAuth, CategoryController.syncCounts); // Sync DB counts

export default router;
