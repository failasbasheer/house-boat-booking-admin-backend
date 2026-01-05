import multer from 'multer';
import path from 'path';
import fs from 'fs';

const getUploadDir = (folder: string) => {
    // Sanitize folder to allow only alphanumeric and dashes
    const safeFolder = (folder || 'misc').replace(/[^a-z0-9-]/gi, '_');
    const dir = path.join(__dirname, '../../uploads', safeFolder);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = req.query.folder as string || 'category'; // Default to category for backward compatibility if needed, or 'misc'
        const uploadDir = getUploadDir(folder);
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'img-' + uniqueSuffix + ext);
    }
});

export const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});
