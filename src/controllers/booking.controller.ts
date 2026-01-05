import { Request, Response } from 'express';
import { Booking } from '../models/Booking';

export const BookingController = {
    create: async (req: Request, res: Response) => {
        try {
            const booking = new Booking(req.body);
            await booking.save();
            res.status(201).json(booking);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    getAll: async (req: Request, res: Response) => {
        try {
            const { page = 1, limit = 50, status } = req.query;
            const query: any = {};
            if (status) query.status = status;

            const bookings = await Booking.find(query)
                .sort({ createdAt: -1 })
                .limit(Number(limit))
                .skip((Number(page) - 1) * Number(limit));

            const total = await Booking.countDocuments(query);

            res.json({
                data: bookings,
                meta: {
                    total,
                    page: Number(page),
                    pages: Math.ceil(total / Number(limit))
                }
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    getOne: async (req: Request, res: Response) => {
        try {
            const booking = await Booking.findById(req.params.id);
            if (!booking) return res.status(404).json({ message: 'Booking not found' });
            res.json(booking);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    },

    update: async (req: Request, res: Response) => {
        try {
            const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!booking) return res.status(404).json({ message: 'Booking not found' });
            res.json(booking);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    assignBoat: async (req: Request, res: Response) => {
        try {
            const { boat_id } = req.body;
            const booking = await Booking.findByIdAndUpdate(
                req.params.id,
                { assigned_boat_id: boat_id, status: 'confirmed' },
                { new: true }
            );
            res.json(booking);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
};
