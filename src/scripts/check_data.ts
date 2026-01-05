import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category } from '../models/Category';
import { Amenity } from '../models/Amenity';
import { Feature } from '../models/Feature';
import { Houseboat } from '../models/Houseboat';
import { connectDB } from '../config/db';

dotenv.config();

const checkData = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        const categoryCount = await Category.countDocuments();
        console.log(`Categories: ${categoryCount}`);

        const categories = await Category.find({}, 'display_name slug imagePlaceholder amenitiesList');
        categories.forEach(c => {
            console.log(` - [${c.slug}] "${c.display_name}":`);
            console.log(`   Img: ${c.imagePlaceholder || '(empty)'}`);
            console.log(`   Amenities: ${c.amenitiesList?.length || 0}`);
        });

        const amenityCount = await Amenity.countDocuments();
        console.log(`Master Amenities: ${amenityCount}`);

        const featureCount = await Feature.countDocuments();
        console.log(`Master Features: ${featureCount}`);

        const boatCount = await Houseboat.countDocuments();
        console.log(`Houseboats: ${boatCount}`);

    } catch (error) {
        console.error('Error checking data:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

checkData();
