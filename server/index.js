import cookieParser from "cookie-parser";
import express from "express";
import {app,server} from "./socket/socketIo.js";
import cors from "cors";
import {connectDB} from "./database/mongodb.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminMiddleware from "./middlewares/adminMiddleware.js";
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

connectDB();

app.use('/user', userRoutes);
app.use('/admin', adminMiddleware, adminRoutes);
app.use('/product', productRoutes);
app.use("/order", orderRoutes);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});