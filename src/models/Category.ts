import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },

    display_name: { type: String, required: true },
    imagePlaceholder: { type: String },
    is_active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },

    tagline: { type: String },
    duration: { type: String },
    guestCapacity: { type: String },
    secondaryDescription: { type: String },
    description: { type: String },
    availableCount: { type: Number, default: 0 },


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
    }]

}, { timestamps: true });

export const Category = mongoose.model('Category', categorySchema);
