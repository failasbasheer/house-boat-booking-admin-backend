import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
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

async function listBuckets() {
    try {
        console.log('Listing buckets...');
        const data = await s3.send(new ListBucketsCommand({}));
        console.log('Buckets:', data.Buckets);
    } catch (err) {
        console.error('Error listing buckets:', err);
    }
}

listBuckets();
