import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { GlobalSettings } from '../models/GlobalSettings';

// Load env
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const seedSettings = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('MongoDB Connected');

        const defaultSettings = {
            whatsappNumber: "916282118829",
            whatsappMessage: "Hi, I'm interested in checking availability for a houseboat experience.",
            contactPhone: "+91 62821 18829",
            contactEmail: "hello@alleppeyhouseboats.com"
        };

        // Update or Insert
        await GlobalSettings.findOneAndUpdate({}, defaultSettings, { upsert: true, new: true, setDefaultsOnInsert: true });

        console.log('✅ Settings Seeded Successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding settings:', err);
        process.exit(1);
    }
};

seedSettings();
