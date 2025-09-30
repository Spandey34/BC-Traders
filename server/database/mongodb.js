import mongoose from "mongoose";

export const connectDB = async () => {
    const MONGODB_URL = process.env.MONGODB_URL;
  try {
    mongoose.connect(MONGODB_URL)
    console.log("Connected to MongoDb")
} catch (error) {
    console.log(error);
}}