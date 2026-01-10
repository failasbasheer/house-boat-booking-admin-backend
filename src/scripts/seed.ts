import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Amenity } from '../models/Amenity';
import { Feature } from '../models/Feature';
import { Badge } from '../models/Badge';

import { Category } from '../models/Category';
import { Houseboat } from '../models/Houseboat';

// Load env from backend root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('MONGO_URI is missing in .env');
    process.exit(1);
}

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing Data
        await Amenity.deleteMany({});
        await Feature.deleteMany({});
        await Badge.deleteMany({});

        await Category.deleteMany({});
        await Houseboat.deleteMany({});
        console.log('🧹 Cleared existing database');

        // --- 1. AMENITIES ---
        const amenities = [
            { name: 'Night AC (9PM-6AM)', icon: 'Fan', category: 'accommodation' },
            { name: '24/7 Full Time AC', icon: 'Snowflake', category: 'accommodation' },
            { name: 'Private Cabin', icon: 'BedDouble', category: 'accommodation' },
            { name: 'Spacious Suite', icon: 'Hotel', category: 'accommodation' },
            { name: 'Presidential Suite', icon: 'Crown', category: 'accommodation' },
            { name: 'Private Balcony', icon: 'LayoutBalcony', category: 'accommodation' },
            { name: 'Attached Bathroom', icon: 'Bath', category: 'bathroom' },
            { name: 'Hot Water', icon: 'ThermometerSun', category: 'bathroom' },
            { name: 'Upper Deck Seating', icon: 'Armchair', category: 'deck' },
            { name: 'Sun Loungers', icon: 'Sun', category: 'deck' },
            { name: 'Wi-Fi', icon: 'Wifi', category: 'technology' },
            { name: 'Music System', icon: 'Music', category: 'technology' },
            { name: 'Life Jackets', icon: 'LifeBuoy', category: 'safety' },
            { name: 'Fire Extinguisher', icon: 'Flame', category: 'safety' },
        ];
        const createdAmenities = await Amenity.insertMany(amenities);
        console.log(`✅ Seeded ${createdAmenities.length} Amenities`);

        // --- 2. FEATURES ---
        const features = [
            { name: 'All Meals Included', category: 'dining' },
            { name: 'Welcome Drink', category: 'dining' },
            { name: 'Kerala Cuisine', category: 'dining' },
            { name: 'North Indian Cuisine', category: 'dining' },
            { name: 'Captain', category: 'crew_role' },
            { name: 'Chef', category: 'crew_role' },
            { name: 'Service Staff', category: 'crew_role' },
            { name: 'Fishing', category: 'entertainment' },
            { name: 'Village Walk', category: 'entertainment' },
            { name: 'Govt. Authorized', category: 'safety' },
            { name: 'Family Friendly', category: 'audience' },
            { name: 'Honeymoon Special', category: 'audience' },
        ];
        const createdFeatures = await Feature.insertMany(features);
        console.log(`✅ Seeded ${createdFeatures.length} Features`);

        // --- 3. BADGES ---
        const badges = [
            { label: 'Bestseller', color: 'orange', icon: 'Star' },
            { label: 'Premium', color: 'purple', icon: 'Crown' },
            { label: 'Luxury', color: 'gold', icon: 'Gem' },
            { label: 'New Arrival', color: 'green', icon: 'Sparkles' },
        ];
        const createdBadges = await Badge.insertMany(badges);
        console.log(`✅ Seeded ${createdBadges.length} Badges`);



        // --- 5. CATEGORIES ---
        const categories = [
            {
                id: 'luxury',
                display_name: 'Luxury Fleet',
                slug: 'luxury',
                base_price: 15000,
                is_active: true,
                description: 'Experience the pinnacle of comfort on the backwaters.',
                amenitiesList: [{ title: 'Full AC', desc: '24/7 Air Conditioning' }]
            },
            {
                id: 'premium',
                display_name: 'Premium Fleet',
                slug: 'premium',
                base_price: 10000,
                is_active: true,
                description: 'High-quality houseboats with excellent amenities.',
                amenitiesList: [{ title: 'Night AC', desc: '9PM - 6AM AC' }]
            },
            {
                id: 'deluxe',
                display_name: 'Deluxe Fleet',
                slug: 'deluxe',
                base_price: 7000,
                is_active: true,
                description: 'Affordable comfort for a memorable journey.',
                amenitiesList: [{ title: 'Standard', desc: 'Basic Amenities' }]
            }
        ];
        const createdCategories = await Category.insertMany(categories);
        console.log(`✅ Seeded ${createdCategories.length} Categories`);

        // --- 6. HOUSEBOATS ---
        // Using real images found in uploads/houseboats to ensure they work
        const luxuryCat = createdCategories.find(c => c.slug === 'luxury');
        const premiumCat = createdCategories.find(c => c.slug === 'premium');

        const houseboats = [
            {
                name: 'Royal Palace',
                slug: 'royal-palace',
                category_id: luxuryCat?._id,
                status: 'active',
                bedrooms: 3,
                capacity_adults: 6,
                has_ac: true,
                cruise_hours: 22,
                price_override: {
                    price_range: { min: 25000, max: 35000 }
                },
                images: {
                    hero: `https://houseboat-booking.s3.ap-south-1.amazonaws.com/houseboats/69500d1a1df798db7e2302aa-hero.jpg`,
                    exterior: `https://houseboat-booking.s3.ap-south-1.amazonaws.com/houseboats/69500d1a1df798db7e2302aa-exterior.jpg`,
                    interior: `https://houseboat-booking.s3.ap-south-1.amazonaws.com/houseboats/69500d1a1df798db7e2302aa-interior.jpg`,
                    bedroom: `https://houseboat-booking.s3.ap-south-1.amazonaws.com/houseboats/69500d1a1df798db7e2302aa-bedroom.jpg`,
                    dining: `https://houseboat-booking.s3.ap-south-1.amazonaws.com/houseboats/69500d1a1df798db7e2302aa-interior.jpg`
                },
                amenities: createdAmenities.map(a => a._id).slice(0, 10),
                features: createdFeatures.map(f => f._id).slice(0, 5),
                shared_package_available: false,
                notes: 'Seeded Data'
            },
            {
                name: 'River Queen',
                slug: 'river-queen',
                category_id: premiumCat?._id,
                status: 'active',
                bedrooms: 2,
                capacity_adults: 4,
                has_ac: true,
                cruise_hours: 20,
                price_override: {
                    price_range: { min: 12000, max: 18000 }
                },
                images: {
                    hero: `https://houseboat-booking.s3.ap-south-1.amazonaws.com/houseboats/69500d191df798db7e23028d-hero.jpg`,
                    exterior: `https://houseboat-booking.s3.ap-south-1.amazonaws.com/houseboats/69500d191df798db7e23028d-exterior.jpg`,
                    interior: `https://houseboat-booking.s3.ap-south-1.amazonaws.com/houseboats/69500d191df798db7e23028d-interior.jpg`,
                    bedroom: `https://houseboat-booking.s3.ap-south-1.amazonaws.com/houseboats/69500d191df798db7e23028d-bedroom.jpg`,
                },
                amenities: createdAmenities.map(a => a._id).slice(5, 12),
                features: createdFeatures.map(f => f._id).slice(3, 8),
                shared_package_available: true,
                notes: 'Seeded Data'
            }
        ];

        const createdBoats = await Houseboat.insertMany(houseboats);
        console.log(`✅ Seeded ${createdBoats.length} Houseboats`);

        console.log('🎉 Database seeded successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
