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
