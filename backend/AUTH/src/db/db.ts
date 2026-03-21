import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export default async function connectDB() {
    try {

        let uri : string = process.env.MONGODB_URI || "";

        await mongoose.connect(uri)

        console.log("Database connected successfully")
        
    } catch (error) {

        console.log("Database is not connected --> ", error);
    }
}