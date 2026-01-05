import express from 'express';
import { upload } from '../config/upload';

const router = express.Router();

router.post('/', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        // Return the URL path
        const folder = (req.query.folder as string || 'category').replace(/[^a-z0-9-]/gi, '_');
        const fileUrl = `/uploads/${folder}/${req.file.filename}`;
        res.json({ url: fileUrl });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
