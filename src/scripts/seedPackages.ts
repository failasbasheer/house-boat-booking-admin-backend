
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Category } from '../models/Category';

// Load env
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const seedPackages = async () => {
    try {
        console.log('Connecting to MongoDB at:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('MongoDB Connected');

        const packages = [
            {
                slug: 'kerala-backwaters-delight',
                display_name: 'Kerala Backwaters Delight',
                tagline: 'Experience the Serenity',
                description: 'A perfect 3-day getaway exploring the tranquil backwaters of Alleppey.',
                imagePlaceholder: '/packages/delight.webp',
                priceDisplay: '₹ 15,000',
                type: 'package',
                isHero: true,
                sortOrder: 1,
                is_active: true
            },
            {
                slug: 'romantic-escape',
                display_name: 'Romantic Escape',
                tagline: 'For Just the Two of You',
                description: 'Candlelight dinners, flower decorations, and complete privacy.',
                imagePlaceholder: '/packages/romantic.webp',
                priceDisplay: '₹ 20,000',
                type: 'package',
                isHero: false,
                sortOrder: 2,
                is_active: true
            },
            {
                slug: 'family-fun-cruise',
                display_name: 'Family Fun Cruise',
                tagline: 'Memories for a Lifetime',
                description: 'Spacious boats with activities for kids and relaxation for adults.',
                imagePlaceholder: '/packages/family.webp',
                priceDisplay: '₹ 25,000',
                type: 'package',
                isHero: false,
                sortOrder: 3,
                is_active: true
            },
            {
                slug: 'luxury-experience',
                display_name: 'Luxury Experience',
                tagline: 'Unmatched Elegance',
                description: 'Premium amenities, butler service, and jacuzzi on board.',
                imagePlaceholder: '/packages/luxury_pkg.webp',
                priceDisplay: '₹ 40,000',
                type: 'package',
                isHero: false,
                sortOrder: 4,
                is_active: true
            },
            {
                slug: 'corporate-retreat',
                display_name: 'Corporate Retreat',
                tagline: 'Business & Leisure',
                description: 'Conference facilities with a view. Perfect for team bonding.',
                imagePlaceholder: '/packages/corporate.webp',
                priceDisplay: '₹ 50,000',
                type: 'package',
                isHero: false,
                sortOrder: 5,
                is_active: true
            }
        ];

        // Ensure we unset other heroes if our seed has one (which it does)
        // Actually, we are just updating these specific docs.

        for (const pkg of packages) {
            console.log(`Seeding package: ${pkg.display_name}`);
            await Category.findOneAndUpdate(
                { slug: pkg.slug },
                {
                    $set: {
                        ...pkg,
                        id: pkg.slug // Set ID same as slug
                    }
                },
                { upsert: true, new: true }
            );
        }

        // Enforce Single Hero Logic
        // We know 'kerala-backwaters-delight' is hero.
        // Unset others.
        console.log('Enforcing single hero...');
        await Category.updateMany(
            { type: 'package', slug: { $ne: 'kerala-backwaters-delight' } },
            { $set: { isHero: false } }
        );

        console.log('✅ Packages Seeded Successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding packages:', err);
        process.exit(1);
    }
};

seedPackages();
