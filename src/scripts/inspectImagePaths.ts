import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Models (defining inline for simplicity or importing if compatible)
// Better to import to match schema, but inline is faster for inspection if simple
// I'll try to import first if paths allow, otherwise inline schema.
// Importing from src might require ts-node to handle imports correctly which we are doing.

const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('MongoDB Connected');
    } catch (err: any) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
};

const houseboatSchema = new mongoose.Schema({
    images: mongoose.Schema.Types.Mixed
});
const Houseboat = mongoose.model('Houseboat', houseboatSchema);

const categorySchema = new mongoose.Schema({
    image: String
});
const Category = mongoose.model('Category', categorySchema);

const inspect = async () => {
    await connectDB();

    console.log('--- Categories ---');
    const categories = await Category.find({ image: { $exists: true } }).limit(5);
    categories.forEach(c => console.log(c._id, c.image));

    console.log('\n--- Houseboats ---');
    const houseboats = await Houseboat.find({}).limit(5);
    houseboats.forEach(h => {
        console.log(h._id);
        const images: any = h.images;
        console.log('  Cover:', images?.cover);
        console.log('  Gallery:', images?.gallery?.length || '0', 'items');
        if (images?.gallery?.length > 0) {
            console.log('  Sample:', images.gallery[0]);
        }
    });

    process.exit(0);
};

inspect();
