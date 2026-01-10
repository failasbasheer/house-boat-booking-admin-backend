
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/houseboat_db';

// Import Models (assumes they are exported from their files)
import { Amenity } from '../models/Amenity';
import { Feature } from '../models/Feature';



const seedMasters = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        // Amenities
        const amenities = [
            { name: 'Climate Control', icon: 'Wind', description: 'AC Bedrooms (9PM - 6AM)', category: 'room' },
            { name: 'Full Board Dining', icon: 'Utensils', description: 'Lunch, Dinner & Breakfast', category: 'dining' },
            { name: 'Private Sundeck', icon: 'Sun', description: 'Open-air viewing area', category: 'deck' },
            { name: 'Connectivity', icon: 'Wifi', description: 'Complimentary Wi-Fi', category: 'general' },
            { name: 'En-suite', icon: 'Droplets', description: 'Private attached bathrooms', category: 'bathroom' },
            { name: 'Hospitality', icon: 'Coffee', description: 'Welcome drink & tea service', category: 'service' },
            { name: 'Central AC', icon: 'Wind', description: '24/7 Climate Control', category: 'room' },
            { name: 'Gourmet Dining', icon: 'Utensils', description: 'Chef-prepared meals', category: 'dining' },
            { name: 'Infinity Deck', icon: 'Sun', description: 'Private pool & lounge', category: 'deck' },
            { name: 'Jacuzzi', icon: 'Droplets', description: 'In-suite private jacuzzi', category: 'bathroom' },
            { name: 'Butler Service', icon: 'Coffee', description: '24/7 Personal Attention', category: 'service' },
            { name: 'Safety Kit', icon: 'Shield', description: 'Life jackets & fire extinguishers', category: 'safety' }
        ];

        // Features
        const features = [
            { name: 'Spacious AC Suites', category: 'accommodation', description: 'Large air-conditioned staterooms' },
            { name: 'Private Balconies', category: 'accommodation', description: 'Balcony overlooking backwaters' },
            { name: 'Multi-Cuisine Dining', category: 'dining', description: 'Kerala, Continental, Chinese options' },
            { name: 'Premium Lounge', category: 'entertainment', description: 'Comfortable upper deck seating' },
            { name: 'Personal Butler', category: 'crew_role', description: 'Dedicated butler for personalized service' },
            { name: 'Infinity Pool', category: 'entertainment', description: 'On-deck plunger pool' },
            { name: 'Private Cinema', category: 'entertainment', description: 'Projector and sound system' },
            { name: 'Ayurvedic Spa', category: 'wellness', description: 'Onboard massage and treatments' },
            { name: 'Candlelight Dinner', category: 'dining', description: 'Romantic dinner setup' },
            { name: 'Flower Bed Decoration', category: 'other', description: 'Special honeymoon arrangement' }
        ];





        // Seed Amenities
        for (const item of amenities) {
            await Amenity.updateOne({ name: item.name }, { $set: item }, { upsert: true });
        }
        console.log(`Seeded ${amenities.length} Amenities`);

        // Seed Features
        for (const item of features) {
            await Feature.updateOne({ name: item.name }, { $set: item }, { upsert: true });
        }
        console.log(`Seeded ${features.length} Features`);





        console.log('Master Data Seeding Complete');
        process.exit(0);

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

seedMasters();
