import express from "express"
import authRouter from "./routes/auth.route.ts";
import cookieParser from "cookie-parser"
import passport from "passport"
import googleStrategy from "./config/google.config.ts";
import rateLimit from "express-rate-limit";
import helmet from 'helmet'



const app = express();

app.use(helmet())


const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 30,
    message: "Too many request from this ip, please try after a minute"
})

app.use(limiter)

app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())

passport.use(googleStrategy());

app.use("/api/auth", authRouter)

export default app;