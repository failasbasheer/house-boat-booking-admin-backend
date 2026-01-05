import mongoose, { Schema, Document } from 'mongoose';

export interface IPricingPlan extends Document {
    title: string;
    duration: string;
    description: string;
    includes: string[];
    priceEstimate: string;
    bestFor: string;
    sortOrder: number;
}

const PricingSchema: Schema = new Schema({
    title: { type: String, required: true },
    duration: { type: String, required: true },
    description: { type: String, required: true },
    includes: { type: [String], required: true },
    priceEstimate: { type: String, required: true },
    bestFor: { type: String, required: true },
    sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

export const PricingPlan = mongoose.model<IPricingPlan>('PricingPlan', PricingSchema);
