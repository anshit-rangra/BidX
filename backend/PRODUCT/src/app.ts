import express from "express";
import helmet from "helmet"
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser"

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

export default app;