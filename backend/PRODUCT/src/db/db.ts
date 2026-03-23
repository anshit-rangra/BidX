import mongoose from "mongoose"
import { config } from "dotenv";
config()


export default async function connectDb() {
    try {
        const URI: string = process.env.MONGODB_URI as string;
        await mongoose.connect(URI)
        
        console.log("Database connected sucessfully !")
    } catch (error: any) {
        console.log("Error while connecting to database => ", error)
        throw new Error(error)
    }
}