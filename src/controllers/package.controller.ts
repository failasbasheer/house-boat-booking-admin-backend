import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Category, Package } from '../models/Category';


export const PackageController = {
    // Get all packages
    getAll: async (req: Request, res: Response) => {
        try {
            const packages = await Package.find({}).sort({ sortOrder: 1 });

            res.json(packages);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get Single Package (by ID or Slug)
    getOne: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const pkg = await Package.findOne({
                $or: [
                    { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
                    { slug: id },
                    { id: id }
                ]
            });

            if (!pkg) return res.status(404).json({ message: 'Package not found' });
            res.json(pkg);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    // Create new package
    create: async (req: Request, res: Response) => {
        try {
            const { display_name, slug, isHero } = req.body;

            // Enforce Single Hero
            if (isHero) {
                await Package.updateMany({ isHero: true }, { $set: { isHero: false } });

            }

            const pkg = new Package({
                ...req.body,
                type: 'package', // Force type
                slug: slug || display_name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                id: slug || display_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            });


            await pkg.save();
            res.status(201).json(pkg);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    // Update package
    update: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { isHero } = req.body;

            // Enforce Single Hero
            if (isHero) {
                await Package.updateMany({ isHero: true, _id: { $ne: id } }, { $set: { isHero: false } });
            }

            const pkg = await Package.findOneAndUpdate(
                { _id: id },
                req.body,
                { new: true }
            );


            if (!pkg) return res.status(404).json({ message: 'Package not found' });
            res.json(pkg);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    // Delete package
    delete: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const pkg = await Package.findOneAndDelete({ _id: id });

            if (!pkg) return res.status(404).json({ message: 'Package not found' });
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
};
