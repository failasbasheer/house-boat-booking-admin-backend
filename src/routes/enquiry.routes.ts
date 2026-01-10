import express from 'express';
import { createEnquiry, getEnquiries, updateEnquiry, deleteEnquiry } from '../controllers/enquiryController';
import { requireAuth } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', createEnquiry); // Public (for website forms)
router.get('/', requireAuth, getEnquiries); // Admin only
router.put('/:id', requireAuth, updateEnquiry);
router.delete('/:id', requireAuth, deleteEnquiry);

export default router;
