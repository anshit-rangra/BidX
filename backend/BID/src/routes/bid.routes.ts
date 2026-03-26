import express from "express"
import bidController from "../controllers/bid.controller.ts"
import authMiddleWare from "../middlewares/auth.middleware.ts";


const router = express.Router()

router.post("/product/:id", authMiddleWare, bidController.bidOnProduct)


export default router;