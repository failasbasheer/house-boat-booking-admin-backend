import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
    boat_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Houseboat', required: true },
    date: { type: Date, required: true },
    is_available: { type: Boolean, default: true },
    // Optional: Add reason or blocks for maintenance? Keeping simple for now as per "is_available" requirement
    status: { type: String, enum: ['available', 'booked', 'blocked', 'maintenance'], default: 'available' }
}, { timestamps: true });

// Compound index to ensure one availability record per boat per date
availabilitySchema.index({ boat_id: 1, date: 1 }, { unique: true });

export const Availability = mongoose.model('Availability', availabilitySchema);
