import express from 'express';
import { PackageController } from '../controllers/package.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', PackageController.getAll);
router.get('/:id', PackageController.getOne);
router.post('/', requireAuth, PackageController.create);
router.put('/:id', requireAuth, PackageController.update);
router.delete('/:id', requireAuth, PackageController.delete);

export default router;
