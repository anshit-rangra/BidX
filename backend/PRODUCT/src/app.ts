import express from "express";
import helmet from "helmet"
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser"
import productRouter from "./routes/products.routes.ts"

const app = express();

app.use(helmet())

const limiter = rateLimit({
    windowMs: 1*60*1000,
    max: 10,
    message: "Too many request from this ip, please try after a minute"
})

app.use(limiter)

app.use(express.json())
app.use(cookieParser())

app.use("/api/product", productRouter)

export default app;