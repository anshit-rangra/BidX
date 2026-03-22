import dotenv from "dotenv"
dotenv.config();
import app from "./src/app.ts"
import connectDB from "./src/db/db.ts";
import { connectMQ } from "./src/broker/broker.ts";

const port: number = Number(process.env.AUTH_PORT) || 3000;


connectDB().then(() => {

    connectMQ()
    app.listen(port, () => {
        console.log("Auth server is running on port ", port)
    })
    
}).catch((error: any) => {
    console.error("Failed to start server:", error);
    process.exit(1);
})