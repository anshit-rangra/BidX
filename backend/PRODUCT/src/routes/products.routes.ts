import express from "express"
import productController from "../controllers/product.controller.ts";
import authMiddleWare from "../middlewares/auth.middleware.ts";
import { getUploadMiddleware } from "../middlewares/uploadProvider.ts";
import validatorMiddleware from "../validators/zod.validator.ts";


const router = express.Router();


router.get("/get", authMiddleWare, productController.getProducts)

router.post("/post", authMiddleWare, getUploadMiddleware(), validatorMiddleware, productController.postProduct)

router.delete("/delete/:id", authMiddleWare, productController.deleteProduct)

router.patch("/bid/:id", authMiddleWare, productController.bidding)

export default router;