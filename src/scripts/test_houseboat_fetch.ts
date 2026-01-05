import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Houseboat } from '../models/Houseboat';
import { connectDB } from '../config/db';
import '../models/Category';
import '../models/Amenity';
import '../models/Feature';

dotenv.config();

const testHouseboats = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        const page = 'undefined';
        const limit = 10;
        const pageNum = Number(page); // NaN
        const skip = (pageNum - 1) * limit; // NaN

        console.log(`Testing skip with: ${skip}`);

        // Mongoose might handle NaN by skipping 0 or throwing
        const houseboats = await Houseboat.find({})
            .populate('category_id', 'display_name slug')
            .skip(skip)
            .limit(limit);

        console.log(`Found ${houseboats.length} houseboats with skip=${skip}`);
        if (houseboats.length > 0) {
            console.log('First houseboat:', JSON.stringify(houseboats[0], null, 2));
        }

    } catch (error) {
        console.error('Error fetching houseboats:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

testHouseboats();
