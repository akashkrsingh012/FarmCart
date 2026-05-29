import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import connectDB from './config/connectDB.js';
import userRouter from './route/user.route.js';
import categoryRouter from './route/category.route.js';
import uploadRouter from './route/upload.router.js';
import subCategoryRouter from './route/subCategory.route.js';
import productRouter from './route/product.route.js';
import cartRouter from './route/cart.route.js';
import addressRouter from './route/address.route.js';
import orderRouter from './route/order.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Enhanced CORS configuration
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Disposition']
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging
app.use(morgan('dev'));

// Static files serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Security headers
app.use(helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            imgSrc: ["'self'", 'data:', 'blob:', 'https://*'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:5173']
        }
    }
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API Routes
app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/file', uploadRouter);
app.use('/api/subcategory', subCategoryRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: `Server is running on port ${process.env.PORT || 8080}`,
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(`[${new Date().toISOString()}] Error:`, err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    res.status(statusCode).json({
        success: false,
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Database connection and server start
connectDB().then(() => {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`Uploads directory: ${uploadDir}`);
    });
}).catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
});