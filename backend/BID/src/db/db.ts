import mongoose from "mongoose";
import { config } from "dotenv"
config()

async function connectDB() {

    try {

        let URI: string = process.env.MONGODB_URI as string;
        await mongoose.connect(URI)
        console.log("Database connected sucessfully !")
    } catch (error) {
        console.log("Error while connect to database ", error)
    }
}

export default connectDB;