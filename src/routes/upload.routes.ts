import express from 'express';
import { upload } from '../config/s3';

const router = express.Router();

router.post('/', upload.single('file'), (req: any, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        // Return the S3 URL
        const fileUrl = req.file.location;
        res.json({ url: fileUrl });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
