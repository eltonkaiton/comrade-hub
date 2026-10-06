import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import houseRoutes from './routes/houseRoutes.js';
import transportRoutes from './routes/transportRoutes.js';
import laundryRoutes from './routes/laundryRoutes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'ComradeHub API is running',
  });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Product routes (marketplace)
app.use('/api/products', productRoutes);

// House routes (housing)
app.use('/api/houses', houseRoutes);

// Transport routes
app.use('/api/transport', transportRoutes);

// Laundry routes
app.use('/api/laundry', laundryRoutes);

// 404 handler (Express 5 — use app.use instead of app.all)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
});

// Global error handler (MUST be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});