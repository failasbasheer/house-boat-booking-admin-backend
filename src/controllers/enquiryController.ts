import { Request, Response } from 'express';
import { Enquiry } from '../models/Enquiry';

// Create a new enquiry (Public)
export const createEnquiry = async (req: Request, res: Response) => {
    try {
        const { name, phone, date, guests, category, message, email } = req.body;

        // Basic validation
        if (!name || !phone) {
            return res.status(400).json({ message: 'Name and Phone are required' });
        }

        const newEnquiry = new Enquiry({
            name,
            phone,
            email,
            date: date || new Date(),
            guests: guests || 'Unknown',
            category: category || 'General',
            message
        });

        await newEnquiry.save();
        res.status(201).json(newEnquiry);
    } catch (error) {
        console.error('Error creating enquiry:', error);
        res.status(500).json({ message: 'Error creating enquiry', error });
    }
};

// Get all enquiries (Admin) - with filters
export const getEnquiries = async (req: Request, res: Response) => {
    try {
        const { search, status, category, startDate, endDate } = req.query;
        let query: any = {};

        if (status) {
            query.status = status;
        }

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate as string);
            if (endDate) query.date.$lte = new Date(endDate as string);
        }

        const enquiries = await Enquiry.find(query).sort({ createdAt: -1 });
        res.json(enquiries);
    } catch (error) {
        console.error('Error fetching enquiries:', error);
        res.status(500).json({ message: 'Error fetching enquiries', error });
    }
};

// Update enquiry status
export const updateEnquiry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const enquiry = await Enquiry.findByIdAndUpdate(id, updates, { new: true });

        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }
        res.json(enquiry);
    } catch (error) {
        res.status(500).json({ message: 'Error updating enquiry', error });
    }
};

// Delete enquiry
export const deleteEnquiry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const enquiry = await Enquiry.findByIdAndDelete(id);

        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }
        res.json({ message: 'Enquiry deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting enquiry', error });
    }
};
