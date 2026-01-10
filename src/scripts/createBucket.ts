import { S3Client, CreateBucketCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import path from 'path';

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

async function createBucket() {
    try {
        console.log('Creating bucket:', process.env.S3_BUCKET_NAME);
        await s3.send(new CreateBucketCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            CreateBucketConfiguration: {
                LocationConstraint: process.env.AWS_REGION as any // ap-south-1
            }
        }));
        console.log('Bucket created successfully.');
    } catch (err: any) {
        console.error('Error creating bucket:', err.message || err);
    }
}

createBucket();
