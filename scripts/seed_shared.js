const mongoose = require('mongoose');
require('dotenv').config();

// Force local connection for debugging if env fails
const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/houseboat-db';
console.log('Using URI (masked):', uri.replace(/:([^:@]+)@/, ':****@'));

async function run() {
    try {
        console.log('Connecting...');
        // Set short timeout
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected to DB');

        const Houseboat = mongoose.model('Houseboat', new mongoose.Schema({
            name: String,
            shared_package_available: Boolean
        }, { strict: false }));

        const count = await Houseboat.countDocuments({});
        console.log('Total boats in DB:', count);

        // Find existing
        const existing = await Houseboat.find({ shared_package_available: true });
        console.log(`Current shared available: ${existing.length}`);

        if (existing.length >= 5) {
            console.log('Constraint met. Existing shared boats:');
            existing.forEach(b => console.log(`- ${b.name}`));
        } else {
            const needed = 5 - existing.length;
            console.log(`Updating ${needed} more boats...`);
            const boats = await Houseboat.aggregate([
                { $match: { shared_package_available: { $ne: true } } },
                { $sample: { size: needed } }
            ]);

            if (boats.length > 0) {
                const ids = boats.map(b => b._id);
                await Houseboat.updateMany(
                    { _id: { $in: ids } },
                    { $set: { shared_package_available: true } }
                );
                console.log('Updated. New shared boats:');
                boats.forEach(b => console.log(`+ ${b.name}`));
            } else {
                console.log('No boats found to update!');
            }
        }

    } catch (err) {
        console.error('ERROR:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
        process.exit(0);
    }
}

run();
