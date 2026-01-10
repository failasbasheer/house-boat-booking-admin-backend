import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Enquiry } from '../models/Enquiry';

// Load env
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/houseboat-db';

const names = ['John Doe', 'Jane Smith', 'Rahul Kumar', 'Anita Raj', 'David Wilson', 'Sarah Conner', 'Mohammed Ali', 'Priya Patel', 'Chris Evans', 'Natasha Romanoff'];
const phones = ['9876543210', '9898989898', '7776665554', '9998887776', '8885552221', '9123456789', '8529637410', '9638527410', '7418529630', '9517532584'];
const categories = ['Luxury Houseboats', 'Premium Houseboats', 'Deluxe Houseboats', 'Kerala Package'];
const statuses = ['new', 'contacted', 'booked', 'lost'];

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

const seedEnquiries = async () => {
    try {
        console.log('Connecting to MongoDB...', MONGO_URI);
        await mongoose.connect(MONGO_URI);
        console.log('Connected.');

        const enquiries = [];
        for (let i = 0; i < 10; i++) {
            enquiries.push({
                name: names[i],
                phone: phones[i],
                email: `${names[i].toLowerCase().replace(' ', '.')}@example.com`,
                date: new Date(Date.now() + Math.random() * 10000000000), // Future date
                guests: Math.floor(Math.random() * 10) + 2, // 2-12 guests
                category: getRandom(categories),
                status: getRandom(statuses),
                message: i % 3 === 0 ? 'Looking for a memorable trip.' : undefined,
                createdAt: new Date(Date.now() - Math.random() * 1000000000) // Past date
            });
        }

        await Enquiry.insertMany(enquiries);
        console.log('Successfully seeded 10 enquiries.');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding enquiries:', error);
        process.exit(1);
    }
};

seedEnquiries();
