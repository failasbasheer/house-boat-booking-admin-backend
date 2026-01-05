import mongoose from 'mongoose';

const featureSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ['highlight', 'service', 'audience', 'crew_role', 'safety', 'accommodation', 'dining', 'wellness', 'entertainment', 'policy', 'other']
    },
    description: { type: String },
    icon: { type: String }
}, { timestamps: true });

export const Feature = mongoose.model('Feature', featureSchema);
