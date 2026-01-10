import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String }, // Optional, but good to have
    date: { type: Date, required: true, default: Date.now },
    guests: { type: String, required: true, default: 'Unknown' }, // Keeping as String as per request ("Unknown" or number)
    category: { type: String, required: true }, // Source or Category
    message: { type: String },

    status: {
        type: String,
        enum: ['new', 'contacted', 'booked', 'lost'],
        default: 'new'
    }
}, { timestamps: true });

export const Enquiry = mongoose.model('Enquiry', enquirySchema);
