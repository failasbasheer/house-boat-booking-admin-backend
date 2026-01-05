import mongoose, { Schema, Document } from 'mongoose';

export interface IFAQ extends Document {
    title: string; // Category Title (e.g., "Booking & Information")
    items: {
        question: string;
        answer: string[]; // Supports multiple paragraphs/points
    }[];
    sortOrder: number;
}

const FAQSchema: Schema = new Schema({
    title: { type: String, required: true },
    items: [{
        question: { type: String, required: true },
        answer: { type: [String], required: true }
    }],
    sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

export const FAQ = mongoose.model<IFAQ>('FAQ', FAQSchema);
