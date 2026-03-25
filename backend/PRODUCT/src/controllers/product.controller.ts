import type { Request, Response } from "express";
import { deletePic, uploadPic } from "../services/imagekitProvider.ts";
import { productModel } from "../models/productModelProvider.ts";

interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: Number;
}

async function getProducts(req: Request, res: Response) {
  const limit: number = Number(req.query.limit)  || 10;
  const page: number = Number(req.query.page)  || 1;

  try {


    
    const products = await productModel.find().sort({ randomScore: 1 }).skip((page -1) * limit)

    if(!products) return res.status(404).json({message: "There is no products in our database."})

    res.status(200).json({ message: "Products fetched sucessfully", products });
  } catch (error) {
    return res.status(500).json({message: "Internal server error"})
  }
}

async function postProduct(req: Request, res: Response) {
  const { title, description, basePrice } = req.body;

  if (!req.files)
    return res.status(404).json({ message: "Please also upload images" });

  const files = req.files as Express.Multer.File[];

  let images: any[] = [];

  try {
    images = await Promise.all(
      files?.map(async (file: File) => {
        const image = await uploadPic(file);
        return image;
      }),
    );
  } catch (error) {
    console.log(error);

    if (images) {
      await Promise.all(
        images.map(async (file: any) => {
          if (file?.fileId) {
            await deletePic(file.fileId);
          }
        }),
      );
    }

    return res.status(500).json({ message: "Unable to upload images" });
  }

  try {
    const imgs = images.map((img) => {
      return { url: img.url, id: img.fileId };
    });

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const newProduct = await productModel.create({
      title,
      description,
      images: imgs,
      currentPrice: basePrice,
      basePrice,
      creator: req.user._id,
    });

    return res
      .status(201)
      .json({ message: "Product created sucessfully !", product: newProduct });
  } catch (error) {
    console.log(error);

    await Promise.all(
      images?.map(async (file) => {
        //fileId
        await deletePic(file.fileId);
      }),
    );

    return res.status(500).json({ message: "Error while uploading product" });
  }
}

async function deleteProduct(req: Request, res: Response) {
  const { id } = req.params;

  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const product = await productModel.findOne({
      _id: id,
      creator: req.user._id,
    });

    if (!product)
      return res
        .status(401)
        .json({ message: "You can not delete this product" });

    await Promise.all(
      product.images.map(async (image) => {
        await deletePic(image.id);
      }),
    );

    await product.deleteOne();

    res.status(200).json({ message: "Product deleted sucessfully ! " });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export default {
  getProducts,
  postProduct,
  deleteProduct,
};
