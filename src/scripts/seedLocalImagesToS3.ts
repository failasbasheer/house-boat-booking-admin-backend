import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
// mime import removed

// Load env
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;
const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');

async function uploadFile(filePath: string, s3Key: string) {
    try {
        const fileContent = fs.readFileSync(filePath);
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: s3Key,
            Body: fileContent,
            ContentType: filePath.endsWith('.png') ? 'image/png' : 'image/jpeg',
            // ACL: 'public-read' // Omit per previous logic
        });
        await s3.send(command);
        console.log(`Uploaded: ${s3Key}`);
        return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    } catch (err) {
        console.error(`Failed to upload ${filePath}:`, err);
        return null;
    }
}

async function migrate() {
    console.log('Starting migration to bucket:', BUCKET_NAME);

    // Process categories
    const catDir = path.join(UPLOADS_DIR, 'category');
    if (fs.existsSync(catDir)) {
        const files = fs.readdirSync(catDir);
        for (const file of files) {
            if (file === '.DS_Store') continue;
            await uploadFile(path.join(catDir, file), `category/${file}`);
        }
    }

    // Process houseboats
    const boatDir = path.join(UPLOADS_DIR, 'houseboats');
    if (fs.existsSync(boatDir)) {
        const files = fs.readdirSync(boatDir);
        for (const file of files) {
            if (file === '.DS_Store') continue;
            await uploadFile(path.join(boatDir, file), `houseboats/${file}`);
        }
    }

    console.log('Migration completed.');
}

migrate();
