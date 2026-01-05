import mongoose from 'mongoose';

const amenitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String }, // Optional Lucide icon name
    description: { type: String },
    category: { type: String, default: 'general' } // e.g. 'room', 'bathroom', 'deck'
}, { timestamps: true });

export const Amenity = mongoose.model('Amenity', amenitySchema);
