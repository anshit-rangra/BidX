import app from "./src/app.ts"
import { config } from "dotenv"
import connectDB from "./src/db/db.ts"
import bidRouter from "./src/routes/bid.routes.ts"

config()

const port: number = Number(process.env.BID_PORT)

app.use("/api/bid", bidRouter)

connectDB().then(() => {
    
    app.listen(port, () => {
        console.log("Bidding server is running on port ", port);
    })
})