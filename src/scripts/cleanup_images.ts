import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Houseboat } from '../models/Houseboat';
import { Category } from '../models/Category';
import { connectDB } from '../config/db';

dotenv.config();

const UPLOADS_DIR = path.join(__dirname, '../../uploads');

const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []) => {
    if (!fs.existsSync(dirPath)) return arrayOfFiles;

    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            // Keep relative path from uploads folder, e.g., "category/file.jpg"
            const relativePath = path.relative(UPLOADS_DIR, path.join(dirPath, file));
            arrayOfFiles.push(relativePath);
        }
    });

    return arrayOfFiles;
};

const cleanupImages = async () => {
    try {
        await connectDB();
        console.log('Connected to DB');

        // 1. Collect all used images from DB
        const usedImages = new Set<string>();

        // Houseboats
        const boats = await Houseboat.find({});
        boats.forEach(boat => {
            if (boat.images) {
                Object.values(boat.images).forEach((url: any) => {
                    if (typeof url === 'string' && url.includes('/uploads/')) {
                        // Extract relative path: "/uploads/category/file.jpg" -> "category/file.jpg"
                        const rel = url.replace(/^\/uploads\//, '');
                        usedImages.add(rel);
                    }
                });
            }
        });

        // Categories
        const categories = await Category.find({});
        categories.forEach(cat => {
            if (cat.imagePlaceholder && cat.imagePlaceholder.includes('/uploads/')) {
                const rel = cat.imagePlaceholder.replace(/^\/uploads\//, '');
                usedImages.add(rel);
            }
        });

        console.log(`Found ${usedImages.size} images referenced in Database.`);

        // 2. Scan disk for actual files
        const allFiles = getAllFiles(UPLOADS_DIR);
        console.log(`Found ${allFiles.length} files in /uploads directory.`);

        // 3. Compare and Delete
        let deletedCount = 0;
        allFiles.forEach(file => {
            // File path search might need to be robust against OS separators
            // But 'usedImages' are likely 'folder/file.jpg' (forward slash) from DB usually
            // 'file' from getAllFiles should ideally be normalized to forward slash for comparison
            const normalizedFile = file.split(path.sep).join('/');

            if (!usedImages.has(normalizedFile)) {
                const fullPath = path.join(UPLOADS_DIR, file);
                console.log(`Deleting unused file: ${file}`);
                fs.unlinkSync(fullPath);
                deletedCount++;
            }
        });

        console.log(`Cleanup Complete. Deleted ${deletedCount} files.`);

        // Cleanup empty directories
        // (Optional: Implement if needed, simple logic omitted for brevity)

    } catch (error) {
        console.error('Error during cleanup:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

cleanupImages();
