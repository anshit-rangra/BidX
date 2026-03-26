import express from "express";
import cookieParser from "cookie-parser"
import cors from "cors"
import bidRouter from "../src/routes/bid.routes.ts"

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: "*" }))

app.use("/api/bid", bidRouter)

export default app;