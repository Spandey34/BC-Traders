import express from 'express';
import { connectDB } from './database/mongodb.js';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import adminRoutes from './routes/adminRoutes.js';
import adminMiddleware from './middlewares/adminMiddleware.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST'],

}));

connectDB();

app.use('/',userRoutes);
app.use('/admin', adminMiddleware, adminRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});