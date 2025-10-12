import express from 'express';
import { connectDB } from './database/mongodb.js';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import productRoutes from "./routes/productRoutes.js"
import cookieParser from 'cookie-parser';
import adminRoutes from './routes/adminRoutes.js';
import orderRoutes from "./routes/orderRoutes.js"
import adminMiddleware from './middlewares/adminMiddleware.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST'],
}));

connectDB();


app.use('/user',userRoutes);
app.use('/admin', adminMiddleware, adminRoutes)
app.use('/product',productRoutes);
app.use("/order",orderRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});