import { Request, Response } from 'express';
import { Amenity } from '../models/Amenity';
import { Feature } from '../models/Feature';
import mongoose from 'mongoose';

// Map 'type' param to Model
const getModel = (type: string) => {
    switch (type) {
        case 'amenities': return Amenity;
        case 'features': return Feature;
        // Add others if models exist, otherwise return null
        default: return null;
    }
};

export const listMasters = async (req: Request, res: Response) => {
    try {
        const { type } = req.params;
        const Model = getModel(type) as any;
        if (!Model) return res.status(400).json({ message: 'Invalid master type' });

        const items = await Model.find();
        res.json(items);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createMaster = async (req: Request, res: Response) => {
    try {
        const { type } = req.params;
        const Model = getModel(type) as any;
        if (!Model) return res.status(400).json({ message: 'Invalid master type' });

        const item = new Model(req.body);
        await item.save();
        res.status(201).json(item);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateMaster = async (req: Request, res: Response) => {
    try {
        const { type, id } = req.params;
        const Model = getModel(type) as any;
        if (!Model) return res.status(400).json({ message: 'Invalid master type' });

        const item = await Model.findByIdAndUpdate(id, req.body, { new: true });
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteMaster = async (req: Request, res: Response) => {
    try {
        const { type, id } = req.params;
        const Model = getModel(type) as any;
        if (!Model) return res.status(400).json({ message: 'Invalid master type' });

        await Model.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


export const seedMasterData = async (req: Request, res: Response) => {
    try {
        // 1. Seed Amenities
        const defaultAmenities = [
            { name: 'Air Conditioning', icon: 'Wind', category: 'comfort' },
            { name: 'Wi-Fi', icon: 'Wifi', category: 'connectivity' },
            { name: 'TV', icon: 'Tv', category: 'entertainment' },
            { name: 'Sound System', icon: 'Speaker', category: 'entertainment' },
            { name: 'Private Bathroom', icon: 'Bath', category: 'comfort' },
            { name: 'Hot Water', icon: 'Thermometer', category: 'comfort' },
            { name: 'Kitchen', icon: 'Utensils', category: 'dining' },
            { name: 'Fishing Rod', icon: 'Fish', category: 'activity' },
            { name: 'Life Jackets', icon: 'LifeBuoy', category: 'safety' },
            { name: 'Fire Extinguisher', icon: 'Flame', category: 'safety' }
        ];

        for (const am of defaultAmenities) {
            await Amenity.findOneAndUpdate(
                { name: am.name },
                { $setOnInsert: am },
                { upsert: true, new: true }
            );
        }

        // 2. Seed Features
        const defaultFeatures = [
            { name: 'Upper Deck', category: 'highlight' },
            { name: 'Glass Wall Room', category: 'highlight' },
            { name: 'Jacuzzi', category: 'wellness' },
            { name: 'Candle Light Dinner', category: 'dining' },
            { name: 'Flower Decoration', category: 'other' },
            { name: 'Welcome Drink', category: 'dining' },
            { name: 'Fruit Basket', category: 'dining' },
            { name: 'Cake', category: 'dining' }
        ];

        for (const feat of defaultFeatures) {
            await Feature.findOneAndUpdate(
                { name: feat.name },
                { $setOnInsert: feat },
                { upsert: true, new: true }
            );
        }

        res.json({ message: 'Master data (Amenities/Features) seeded successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
