import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    type: { type: String, enum: ['category', 'package'], default: 'category' },

    display_name: { type: String, required: true },
    base_price: { type: Number },
    whatsappTemplate: { type: String },
    imagePlaceholder: { type: String },
    is_active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },

    tagline: { type: String },
    duration: { type: String },
    guestCapacity: { type: String },
    secondaryDescription: { type: String },
    description: { type: String },
    availableCount: { type: Number, default: 0 },

    // Promo / Hero
    priceDisplay: { type: String },
    isHero: { type: Boolean, default: false },


    amenitiesList: [{
        title: String,
        desc: String,
        icon: String
    }],

    stats: {
        rating: { type: Number, default: 0 }
    },

    reviews: [{
        name: String,
        location: String,
        text: String
    }],

    // Package Specific Fields
    itinerary: [{
        day: { type: Number },
        title: { type: String },
        activity: { type: String }
    }],
    inclusions: [String],
    exclusions: [String]

}, { timestamps: true });

export const Category = mongoose.model('Category', categorySchema);
export const Package = mongoose.model('Package', categorySchema, 'packages');

