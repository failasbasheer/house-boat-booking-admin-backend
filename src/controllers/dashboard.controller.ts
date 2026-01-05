import { Request, Response } from 'express';
import { Houseboat } from '../models/Houseboat';
import { Category } from '../models/Category';
import { Amenity } from '../models/Amenity';
import { Feature } from '../models/Feature';

export const DashboardController = {
    getStats: async (req: Request, res: Response) => {
        try {
            const [
                totalHouseboats,
                activeHouseboats,
                totalCategories,
                activeCategories,
                totalAmenities,
                totalFeatures
            ] = await Promise.all([
                Houseboat.countDocuments(),
                Houseboat.countDocuments({ status: 'active' }),
                Category.countDocuments(),
                Category.countDocuments({ is_active: true }),
                Amenity.countDocuments(),
                Feature.countDocuments()
            ]);

            res.json({
                houseboats: {
                    total: totalHouseboats,
                    active: activeHouseboats
                },
                categories: { // Mapping "Active Packages" to Active Categories
                    total: totalCategories,
                    active: activeCategories
                },
                masters: {
                    amenities: totalAmenities,
                    features: totalFeatures,
                    routes: 0, // Placeholder
                    badges: 0  // Placeholder
                }
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
};
