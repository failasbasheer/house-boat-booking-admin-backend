
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/houseboat_db';

const createAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        const username = 'admin';
        const password = 'admin123'; // Ideally prompts or env var, but static for initial setup

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Upsert admin user
        const result = await User.findOneAndUpdate(
            { username },
            {
                username,
                passwordHash,
                role: 'admin'
            },
            { upsert: true, new: true }
        );

        console.log(`Admin user '${username}' created/updated successfully.`);
        console.log(`Password: ${password}`);
        console.log('Please change this password immediately or store it securely.');

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

createAdmin();
