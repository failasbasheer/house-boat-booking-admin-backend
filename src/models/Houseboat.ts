import mongoose from 'mongoose';

const houseboatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, required: true },

  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

  status: { type: String, enum: ['active', 'maintenance', 'decommissioned'], default: 'active' },

  bedrooms: { type: Number, required: true, default: 1 },
  capacity_adults: { type: Number, required: true, default: 2 },
  capacity_children: { type: Number, default: 0 },
  has_ac: { type: Boolean, default: true },
  cruise_hours: { type: Number, default: 22 },



  shared_package_available: { type: Boolean, default: false },

  images: {
    hero: { type: String, required: true },
    exterior: { type: String, required: true },
    interior: { type: String, required: true },
    bedroom: { type: String, required: true },
    dining: String,
    bathroom: String,
    extra1: String,
    extra2: String,
    extra3: String,
  },

  amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amenity' }],
  features: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feature' }],

  notes: String

}, { timestamps: true });

export const Houseboat = mongoose.model('Houseboat', houseboatSchema);