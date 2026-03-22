import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export default async function connectDB() {
    try {

        let uri : string = process.env.MONGODB_URI || "";

        if(!uri) throw new Error("MONGODB_URI is not defined in environment variables");

        await mongoose.connect(uri)

        console.log("Database connected successfully")
        return true;
        
    } catch (error: any) {

        console.error("Database connection error --> ", error.message || error);
        throw new Error(error);
    }
}