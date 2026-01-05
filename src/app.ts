import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import path from 'path';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/error';

import authRoutes from './routes/auth.routes';
import houseboatRoutes from './routes/houseboats.routes';
import masterRoutes from './routes/master.routes';
import categoryRoutes from './routes/category.routes';
import availabilityRoutes from './routes/availability.routes';
import bookingRoutes from './routes/booking.routes';
import uploadRoutes from './routes/upload.routes';
import dashboardRoutes from './routes/dashboard.routes';
import contentRoutes from './routes/content.routes';

const app = express();

connectDB();

app.use(compression());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json() as any);
app.use(cookieParser() as any);

app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  maxAge: '1d',
  immutable: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/houseboats', houseboatRoutes);
app.use('/api/masters', masterRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(errorHandler);

export default app;