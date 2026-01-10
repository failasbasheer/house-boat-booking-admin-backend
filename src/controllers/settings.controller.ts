import { Request, Response } from 'express';
import { GlobalSettings } from '../models/GlobalSettings';

export const getSettings = async (req: Request, res: Response) => {
    try {
        // Find the first (and usually only) settings document
        let settings = await GlobalSettings.findOne();

        // If not found, returns null or we can return defaults
        if (!settings) {
            // Optional: Return defaults if not seeded yet
            return res.json({
                whatsappNumber: "916282118829",
                whatsappMessage: "Hi, I'm interested in checking availability for a houseboat experience.",
                contactPhone: "+91 62821 18829",
                contactEmail: "hello@alleppeyhouseboats.com"
            });
        }
        res.json(settings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSettings = async (req: Request, res: Response) => {
    try {
        // Upsert: update the first document found, or create if none
        const settings = await GlobalSettings.findOneAndUpdate({}, req.body, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        });
        res.json(settings);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
