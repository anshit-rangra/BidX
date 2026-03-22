import express from "express"
import authRouter from "./routes/auth.route.ts";
import cookieParser from "cookie-parser"
import passport from "passport"
import googleStrategy from "./config/google.config.ts";
const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())

passport.use(googleStrategy());

app.use("/api/auth", authRouter)

export default app;