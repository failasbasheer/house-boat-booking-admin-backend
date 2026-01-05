import { Request, Response } from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { Category } from '../models/Category';

export const CategoryController = {
    // Get all categories
    getAll: async (req: Request, res: Response) => {
        try {
            const categories = await Category.aggregate([
                {
                    $lookup: {
                        from: 'houseboats',
                        localField: '_id',
                        foreignField: 'category_id',
                        as: 'houseboats'
                    }
                },
                {
                    $addFields: {
                        fleet_size: { $size: '$houseboats' }
                    }
                },
                {
                    $project: {
                        houseboats: 0 // Remove the heavy houseboats array from result
                    }
                },
                { $sort: { sortOrder: 1 } }
            ]);

            res.json(categories);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    // Create new category
    create: async (req: Request, res: Response) => {
        try {
            const { display_name, id, slug } = req.body;
            // Generate slug/id if missing
            const finalSlug = slug || id || display_name?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const finalId = id || finalSlug;

            const category = new Category({
                ...req.body,
                id: finalId,
                slug: finalSlug
            });
            await category.save();

            res.status(201).json(category);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    // Update category
    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            // Allow updating all fields passed in body
            const category = await Category.findByIdAndUpdate(
                id,
                req.body,
                { new: true }
            );

            if (!category) return res.status(404).json({ message: 'Category not found' });

            res.json(category);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    // Delete category
    delete: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const category = await Category.findById(id);
            if (!category) return res.status(404).json({ message: 'Category not found' });

            // Delete associated image if it's an uploaded file
            // Note: Seeded images like '/packages/deluxe.webp' shouldn't be deleted if they are not in uploads/.
            // But if user uploaded an image override, it might be in /uploads.
            // Check 'image' or 'imagePlaceholder' field (Schema dependent)
            // Assuming imagePlaceholder is the field.
            const imageUrl = category.imagePlaceholder;
            if (imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('/uploads/')) {
                const filePath = path.join(__dirname, '../../', imageUrl);
                if (fs.existsSync(filePath)) {
                    try { fs.unlinkSync(filePath); } catch (err) { console.error('Failed to delete file:', filePath, err); }
                }
            }

            await Category.findByIdAndDelete(id);

            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    // Initialize defaults (Helper to seed)
    seedDefaults: async (req: Request, res: Response) => {
        try {
            const defaults = [
                {
                    id: 'deluxe',
                    slug: 'deluxe',
                    display_name: 'Deluxe',
                    tagline: 'Affordable Luxury on the Backwaters',
                    description: 'Comfortable and affordable houseboats ideal for budget-conscious travelers. Enjoy traditional Kerala hospitality with essential modern amenities.',
                    secondaryDescription: 'Perfect for couples and small families looking for an authentic experience without breaking the bank.',
                    imagePlaceholder: '/packages/deluxe.webp',
                    guestCapacity: '2 - 4 Guests',
                    duration: 'Overnight',
                    amenitiesList: [
                        { title: 'Air Conditioning', desc: 'Bedroom AC (9PM - 6AM)', icon: 'Wind' },
                        { title: 'Full Board Meals', desc: 'Traditional Kerala Cuisine', icon: 'Utensils' },
                        { title: 'Private Bedroom', desc: 'Attached Bathroom', icon: 'Bed' }
                    ],
                    stats: { rating: 4.5 },
                    reviews: [
                        { name: 'John Doe', location: 'UK', text: 'Classic experience, great food!' }
                    ],
                    sortOrder: 1,
                    is_active: true
                },
                {
                    id: 'premium',
                    slug: 'premium',
                    display_name: 'Premium',
                    tagline: 'Elevated Comfort & Style',
                    description: 'Enhanced comfort with better amenities and spacious interiors. Full-time air conditioning and premium dining options.',
                    secondaryDescription: 'Ideal for travelers seeking a balance of luxury and tradition with added comforts.',
                    imagePlaceholder: '/packages/premium.webp',
                    guestCapacity: '2 - 6 Guests',
                    duration: 'Overnight / Day Cruise',
                    amenitiesList: [
                        { title: 'Full Time AC', desc: 'AC in Bedroom anytime', icon: 'Wind' },
                        { title: 'Premium Dining', desc: 'Expanded Menu Options', icon: 'Utensils' },
                        { title: 'Spacious Deck', desc: 'Private Upper Deck', icon: 'Sun' }
                    ],
                    stats: { rating: 4.8 },
                    reviews: [
                        { name: 'Jane Smith', location: 'USA', text: 'Wonderful boat, amazing service.' }
                    ],
                    sortOrder: 2,
                    is_active: true
                },
                {
                    id: 'luxury',
                    slug: 'luxury',
                    display_name: 'Luxury',
                    tagline: 'The Pinnacle of Backwater Living',
                    description: 'Top-tier houseboats with premium furnishings, AC in all areas, and superior service. Experience a floating hotel.',
                    secondaryDescription: 'For those who demand the best – jacuzzi, glass walls, and uniform staff.',
                    imagePlaceholder: '/packages/luxury.webp',
                    guestCapacity: '2 - 10 Guests',
                    duration: 'Custom Itineraries',
                    amenitiesList: [
                        { title: 'Central AC', desc: 'Fully Air Conditioned Boat', icon: 'Wind' },
                        { title: 'Luxury Interiors', desc: '5-Star Hotel Furnishings', icon: 'Star' },
                        { title: 'Butler Service', desc: 'Dedicated Personal Staff', icon: 'User' }
                    ],
                    stats: { rating: 4.9 },
                    reviews: [
                        { name: 'Robert B.', location: 'Germany', text: 'Absolutely world-class experience.' }
                    ],
                    sortOrder: 3,
                    is_active: true
                },
                {
                    id: 'romantic',
                    slug: 'romantic',
                    display_name: 'Honeymoon Special',
                    tagline: 'Romantic Getaway',
                    description: 'Specially designed boats for couples with flower decorations, candle light dinner, and complete privacy.',
                    secondaryDescription: 'Create unforgettable memories with your loved one on the serene backwaters.',
                    imagePlaceholder: '',
                    guestCapacity: '2 Guests',
                    duration: 'Honeymoon Package',
                    amenitiesList: [
                        { title: 'Flower Decor', desc: 'Welcome Decoration', icon: 'Heart' },
                        { title: 'Candle Light Dinner', desc: 'Romantic Evening Setup', icon: 'Flame' },
                        { title: 'Privacy', desc: 'Exclusive Crew Policy', icon: 'Shield' }
                    ],
                    stats: { rating: 5.0 },
                    reviews: [],
                    sortOrder: 4,
                    is_active: true
                }
            ];

            // Clear existing to remove old schema structure (Optional: or just upsert)
            // await Category.deleteMany({}); // Dangerous to uncomment

            for (const def of defaults) {
                await Category.findOneAndUpdate(
                    { slug: def.slug },
                    {
                        $set: {
                            id: def.id,
                            slug: def.slug,
                        },
                        $setOnInsert: {
                            display_name: def.display_name,
                            is_active: def.is_active,
                            sortOrder: def.sortOrder,
                            // Set these fields if missing or just overwrite them? 
                            // Using $set for seeded content ensures DB matches code.
                            // But original code used $setOnInsert for display_name, which means it wouldn't update.
                            // Let's move these to $set to FORCE update the missing data.
                        }
                    },
                    { upsert: true, new: true }
                );

                // Second pass to ensure rich data is set even if document exists
                // We do this to "fix" the existing documents that have missing data.
                await Category.findOneAndUpdate(
                    { slug: def.slug },
                    {
                        $set: {
                            tagline: def.tagline,
                            description: def.description,
                            secondaryDescription: def.secondaryDescription,
                            guestCapacity: def.guestCapacity,
                            duration: def.duration,
                            amenitiesList: def.amenitiesList,
                            stats: def.stats,
                            reviews: def.reviews,
                            imagePlaceholder: def.imagePlaceholder
                        }
                    }
                );
            }

            // Sync counts after seeding
            await CategoryController.syncCounts(req, res);
            // Response sent by syncCounts if called directly, but here we might double send? 
            // Better to split logic or just call internal function. 
            // For now, let's keep seedDefaults simple and just return.
            // Actually, let's implement syncCounts separately and not call it here to avoid response conflicts.

            if (!res.headersSent) res.json({ message: 'Categories seeded' });
        } catch (error: any) {
            if (!res.headersSent) res.status(500).json({ message: error.message });
        }
    },

    // Internal helper to sync counts
    syncCategoryCounts: async () => {
        try {
            await Category.updateMany({}, { $set: { availableCount: 0 } });
            const counts = await mongoose.model('Houseboat').aggregate([
                { $group: { _id: '$category_id', count: { $sum: 1 } } }
            ]);
            for (const c of counts) {
                if (c._id) {
                    await Category.findByIdAndUpdate(c._id, { availableCount: c.count });
                }
            }
            console.log('Category counts synced');
        } catch (error) {
            console.error('Failed to sync category counts', error);
        }
    },

    // Sync availableCount in DB (Route Handler)
    syncCounts: async (req: Request, res: Response) => {
        try {
            await CategoryController.syncCategoryCounts();
            res.json({ message: 'Category counts synced' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
};
