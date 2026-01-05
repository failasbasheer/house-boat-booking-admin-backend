import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { CategoryController } from './category.controller';
import { Houseboat } from '../models/Houseboat';
import '../models/Category';
import '../models/Amenity';
import '../models/Feature';

// Helper to generate unique slug
const generateSlug = async (name: string, currentId?: string) => {
  const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  let slug = baseSlug;
  let counter = 1;

  while (await Houseboat.findOne({ slug, _id: { $ne: currentId } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
};

export const listHouseboats = async (req: any, res: any) => {
  try {
    const { status, page = 1, limit = 10, shared_package_available, sort, category } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const query: any = {};
    if (status) query.status = status;
    if (category) query.category_id = category;
    if (shared_package_available !== undefined) {
      query.shared_package_available = shared_package_available === 'true';
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { 'price_override.price_range.min': 1 };
    else if (sort === 'price_desc') sortOption = { 'price_override.price_range.min': -1 };
    else if (sort === 'name_asc') sortOption = { name: 1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };

    const [boats, total] = await Promise.all([
      Houseboat.find(query)
        .populate('category_id', 'display_name slug') // Use new category link
        .populate('amenities', 'name icon')
        .populate('features', 'name category')
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit)),
      Houseboat.countDocuments(query)
    ]);

    res.json({
      data: boats,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

export const getHouseboat = async (req: any, res: any) => {
  try {
    const boat = await Houseboat.findById(req.params.id)
      .populate('category_id')
      .populate('amenities')
      .populate('features');
    if (!boat) return res.status(404).json({ message: 'Not found' });
    res.json(boat);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

export const getHouseboatBySlug = async (req: any, res: any) => {
  try {
    const boat = await Houseboat.findOne({ slug: req.params.slug })
      .populate('category_id')
      .populate('amenities')
      .populate('features');
    if (!boat) return res.status(404).json({ message: 'Not found' });
    res.json(boat);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

export const createHouseboat = async (req: any, res: any) => {
  try {
    const { name, slug: providedSlug } = req.body;

    // Ensure slug is unique whether provided or generated from name
    const baseForSlug = providedSlug || name;
    const slug = await generateSlug(baseForSlug);

    const boat = new Houseboat({ ...req.body, slug });
    await boat.save();

    // Update fleet count
    await CategoryController.syncCategoryCounts();

    res.status(201).json(boat);
  } catch (e: any) { res.status(400).json({ error: e.message }); }
};

export const updateHouseboat = async (req: any, res: any) => {
  try {
    // If name changes but slug doesn't, we generally keep the slug unless explicitly asked to change
    // If slug is provided, we must check uniqueness
    if (req.body.slug) {
      req.body.slug = await generateSlug(req.body.slug, req.params.id); // Ensure uniqueness even if manually provided/modified
    }

    const boat = await Houseboat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(boat);
  } catch (e: any) { res.status(400).json({ error: e.message }); }
};

export const deleteHouseboat = async (req: any, res: any) => {
  try {
    const boat = await Houseboat.findById(req.params.id);
    if (!boat) return res.status(404).json({ message: 'Not found' });

    // Delete associated images
    if (boat.images) {
      Object.values(boat.images).forEach((imageUrl: any) => {
        if (typeof imageUrl === 'string' && imageUrl.startsWith('/uploads/')) {
          // Construct absolute path
          const filePath = path.join(__dirname, '../../', imageUrl);
          if (fs.existsSync(filePath)) {
            try { fs.unlinkSync(filePath); } catch (err) { console.error('Failed to delete file:', filePath, err); }
          }
        }
      });
    }

    await Houseboat.findByIdAndDelete(req.params.id);

    // Update fleet count
    await CategoryController.syncCategoryCounts();

    res.status(204).send();
  } catch (e: any) { res.status(500).json({ error: e.message }); }
};

export const migratePricing = async (req: any, res: any) => {
  try {
    const collection = Houseboat.collection;
    const boats = await collection.find({}).toArray();
    let updatedCount = 0;

    for (const b of boats) {
      // Check if ALREADY in new deeply nested format
      const hasDeepNest = b.price_override?.price_range?.min !== undefined;

      if (!hasDeepNest) {
        // Source could be price_override.min (from prev step) or min_price (legacy)
        const oldMin = (b.price_override as any)?.min ?? b.min_price ?? 0;
        const oldMax = (b.price_override as any)?.max ?? b.max_price ?? 0;

        const newStructure = {
          price_range: {
            min: oldMin,
            max: oldMax
          }
        };

        await collection.updateOne(
          { _id: b._id },
          {
            $set: { price_override: newStructure },
            $unset: { min_price: "", max_price: "" }
          }
        );
        updatedCount++;
      }
    }

    res.json({ message: 'Migration (Deep Nest) complete', updatedCount, totalScanned: boats.length });
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};