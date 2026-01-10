import mongoose, { Document, Schema } from 'mongoose';

export interface IGlobalSettings extends Document {
    whatsappNumber: string;
    whatsappMessage: string;
    contactPhone: string;
    contactEmail: string;
}

const GlobalSettingsSchema: Schema = new Schema({
    whatsappNumber: { type: String, required: true },
    whatsappMessage: { type: String, required: true },
    contactPhone: { type: String, required: true },
    contactEmail: { type: String, required: true },
}, { timestamps: true });

// Singleton pattern: ensure only one settings doc exists usually, or just use findOne()
export const GlobalSettings = mongoose.model<IGlobalSettings>('GlobalSettings', GlobalSettingsSchema);
