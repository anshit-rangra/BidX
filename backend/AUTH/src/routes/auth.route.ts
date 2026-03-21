import express from "express"
import authControllers from "../controller/auth.controller.ts"
import upload from "../middlewares/multer.middleware.ts";

const router = express.Router();


router.get("/", authControllers.home)

router.post("/register/user", upload.single("profilePic"), authControllers.registration)

export default router;