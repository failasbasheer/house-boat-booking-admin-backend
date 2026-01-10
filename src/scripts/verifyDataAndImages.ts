import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

// S3 Setup
const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});
const BUCKET_NAME = process.env.S3_BUCKET_NAME!;

// DB Setup
const houseboatSchema = new mongoose.Schema({
    name: String,
    images: mongoose.Schema.Types.Mixed
});
const Houseboat = mongoose.model('Houseboat', houseboatSchema);

const categorySchema = new mongoose.Schema({
    display_name: String,
    image: String
});
const Category = mongoose.model('Category', categorySchema);

async function verify() {
    console.log('--- AWS S3 CONTENT ---');
    try {
        const command = new ListObjectsV2Command({ Bucket: BUCKET_NAME });
        const response = await s3.send(command);
        const s3Keys = response.Contents?.map(c => c.Key) || [];
        console.log(`Found ${s3Keys.length} files in bucket '${BUCKET_NAME}':`);
        s3Keys.forEach(key => console.log(` - ${key}`));

        console.log('\n--- MONGODB CONTENT ---');
        await mongoose.connect(process.env.MONGO_URI!);

        const houseboats = await Houseboat.find({});
        console.log(`Found ${houseboats.length} Houseboats:`);
        houseboats.forEach(h => {
            console.log(` [${h.name}]`);
            const images: any = h.images;
            if (images) {
                Object.entries(images).forEach(([key, url]) => {
                    if (typeof url === 'string') {
                        console.log(`   - ${key}: ${url}`);
                    }
                });
            }
        });

        const categories = await Category.find({});
        console.log(`\nFound ${categories.length} Categories:`);
        categories.forEach(c => {
            console.log(` [${c.display_name}]`);
            if (c.image) console.log(`   - image: ${c.image}`);
        });

    } catch (err) {
        console.error('Error during verification:', err);
    } finally {
        await mongoose.disconnect();
    }
}

verify();
