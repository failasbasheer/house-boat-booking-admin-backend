import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
    label: { type: String, required: true },
    color: { type: String, default: 'blue' }, // e.g. 'blue', 'green', 'gold'
    icon: { type: String }
}, { timestamps: true });

export const Badge = mongoose.model('Badge', badgeSchema);
