import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    guestName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String },

    category: { type: String, required: true }, // slug: deluxe/premium/etc
    date: { type: Date, required: true },

    adults: { type: Number, required: true, default: 2 },
    children: { type: Number, default: 0 },

    assignedBoatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Houseboat' },

    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    totalAmount: Number,
    advanceAmount: Number,

    notes: String
}, { timestamps: true });

export const Booking = mongoose.model('Booking', bookingSchema);
