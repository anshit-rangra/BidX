import dotenv from "dotenv"
dotenv.config();
import app from "./src/app.ts"
import connectDB from "./src/db/db.ts";



const port: number = Number(process.env.AUTH_PORT) || 3000;

connectDB().then(() => {

    app.listen(port, () => {
        console.log("Server is running on port ", port)
    })
    
})