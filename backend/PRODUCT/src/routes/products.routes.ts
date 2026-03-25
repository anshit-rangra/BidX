import express from "express"
import productController from "../controllers/product.controller.ts";
import authMiddleWare from "../middlewares/auth.middleware.ts";
import upload from "../middlewares/multer.middleware.ts";
import validatorMiddleware from "../validators/zod.validator.ts";


const router = express.Router();


router.get("/get", authMiddleWare, productController.getProducts)

router.post("/post", authMiddleWare, upload.array("images", 5), validatorMiddleware, productController.postProduct)

router.delete("/delete/:id", authMiddleWare, productController.deleteProduct)

export default router;