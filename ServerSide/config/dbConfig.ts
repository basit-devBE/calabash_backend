import mongoose from "mongoose";
import dotenv from "dotenv";

export const dbConfig = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database connection failed");
    }
}
   