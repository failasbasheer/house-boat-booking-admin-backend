import { Request, Response } from 'express';
import { Availability } from '../models/Availability';
import mongoose from 'mongoose';

export const AvailabilityController = {
    // Get availability for range
    getRange: async (req: Request, res: Response) => {
        try {
            const { start, end, boat_id } = req.query;
            const query: any = {};

            if (start && end) {
                query.date = {
                    $gte: new Date(start as string),
                    $lte: new Date(end as string)
                };
            }

            if (boat_id) {
                query.boat_id = boat_id;
            }

            const availabilities = await Availability.find(query).populate('boat_id', 'name slug');
            res.json(availabilities);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update single availability
    update: async (req: Request, res: Response) => {
        try {
            const { boat_id, date, is_available, status } = req.body;

            const record = await Availability.findOneAndUpdate(
                { boat_id, date: new Date(date) },
                { is_available, status },
                { upsert: true, new: true }
            );

            res.json(record);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    // Bulk update (e.g. block a month)
    bulkUpdate: async (req: Request, res: Response) => {
        try {
            const { boat_id, startDate, endDate, status } = req.body;
            const start = new Date(startDate);
            const end = new Date(endDate);
            const is_available = status === 'available';

            const operations = [];
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                operations.push({
                    updateOne: {
                        filter: { boat_id, date: new Date(d) },
                        update: { $set: { status, is_available } },
                        upsert: true
                    }
                });
            }

            if (operations.length > 0) {
                await Availability.bulkWrite(operations);
            }

            res.json({ message: 'Availability updated successfully' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
};
