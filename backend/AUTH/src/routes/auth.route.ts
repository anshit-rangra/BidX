import express from "express"
import authControllers from "../controller/auth.controller.ts"
import upload from "../middlewares/multer.middleware.ts";
import validatorMiddleware from "../validators/user.validator.ts";
import authMiddleWare from "../middlewares/auth.middleware.ts";
import passport from "passport";

const router = express.Router();


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email']}))

router.get('/google/callback', passport.authenticate('google',  { session: false }), authControllers.googleCallback)

router.get("/", authControllers.home)

router.post("/register/user", upload.single("profilePic"), validatorMiddleware, authControllers.registration)

router.post("/login", authControllers.login)

router.get("/my-account", authMiddleWare, authControllers.myAccount)

router.get("/refresh", authMiddleWare, authControllers.refreshToken)

router.post("/logout", authControllers.logout)

export default router;