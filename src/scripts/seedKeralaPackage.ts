import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category } from '../models/Category';

import path from 'path';

// Try multiple paths for .env
const envPath = path.resolve(__dirname, '../../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

// Fallback if that didn't work (e.g. running from root)
if (!process.env.MONGO_URI) {
    console.log('Loading .env from default location');
    dotenv.config();
}

const URI = process.env.MONGO_URI || 'mongodb://localhost:27017/houseboats_db';
console.log('Using Mongo URI:', URI.split('@').pop()); // Log masked URI for safety

const KERALA_PACKAGE = {
    id: 'kerala-package',
    slug: 'kerala-package',
    display_name: 'The Kerala Holiday Package',
    tagline: 'Signature Experience',
    type: 'package',
    base_price: 12999,
    duration: '3 Days / 4 Nights',
    whatsappTemplate: "Hi, I'm interested in the Kerala Holiday Package.",
    imagePlaceholder: '/kerala-tourism.jpg', // Placeholder
    is_active: true,
    sortOrder: 1,
    description: 'A curated 3-day voyage through the untapped backwaters.',
    secondaryDescription: 'Experience the magic of Kerala with our signature holiday package.',
    amenitiesList: [
        { title: 'Duration', desc: '3 Days / 4 Nights', icon: 'Clock' },
        { title: 'Starting From', desc: '₹ 12,999', icon: 'IndianRupee' }
    ],
    stats: { rating: 4.9 },
    reviews: []
};


const seedKeralaPackage = async () => {
    try {
        if (!URI) {
            throw new Error('Mongo URI is not defined');
        }
        await mongoose.connect(URI);
        console.log('Connected to MongoDB');

        await Category.findOneAndUpdate(
            { slug: 'kerala-package' },
            { $set: KERALA_PACKAGE },
            { upsert: true, new: true }
        );

        console.log('Kerala Package seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedKeralaPackage();
