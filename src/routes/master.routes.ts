import express from 'express';
import { listMasters, createMaster, updateMaster, deleteMaster } from '../controllers/master.controller';

const router = express.Router();

// Valid types: amenities, features, badges
router.get('/:type', listMasters as any);
router.post('/:type', createMaster as any);
router.put('/:type/:id', updateMaster as any);
router.delete('/:type/:id', deleteMaster as any);

export default router;
