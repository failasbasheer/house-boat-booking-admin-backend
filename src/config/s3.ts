import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});

export const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME!,
        // acl: 'public-read', // Deprecated/often blocked by 'Block Public Access'. Better to use bucket policy or CloudFront. 
        // Assuming bucket is public or we perform signed URL. But usually for simplistic hosting, public-read if allowed.
        // User didn't specify ACL. I'll stick to default (private) and rely on bucket policy, or try public-read if needed.
        // Given typically these images are public website assets, they should be public. 
        // However, 'acl' in multer-s3 is optional. Let's omit for now to avoid permission errors if Block Public ACLs is on.
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req: any, file, cb) {
            const folder = (req.query.folder as string || 'misc').replace(/[^a-z0-9-]/gi, '_');
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            cb(null, `${folder}/${uniqueSuffix}${ext}`);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});
