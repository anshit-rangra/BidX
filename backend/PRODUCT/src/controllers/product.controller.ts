import type { Request, Response } from "express"
import { deletePic, uploadPic } from "../services/imagekit.service.ts";
import productModel from "../models/product.model.ts";

interface File {
    fieldname: string,
    originalname: string,
    encoding: string,
    mimetype: string,
    destination: string,
    filename: string,
    path: string,
    size: Number
}

async function getProducts(req: Request, res: Response) {

    res.status(200).json({message: "Products fetched sucessfully"})
}

async function postProduct(req: Request, res: Response) {
    const { title, description, basePrice } = req.body;

    if(!req.files) return res.status(404).json({message: "Please also upload images"})
    
    const files = req.files as Express.Multer.File[];

    let images : any[] = [];

    try {
        
    images = await Promise.all(files?.map(async (file: File) => {
        const image = await uploadPic(file)
        return image;
    }))
    
    
} catch(error) {
    console.log(error)

    if(images){
            await Promise.all(
            images.map(async (file: any) => {
                if (file?.fileId) {
                    await deletePic(file.fileId);
                }
            })
        );
        }

    return res.status(500).json({message: "Unable to upload images"})
}

try {

    const imgs = images.map((img) => {
        return { url: img.url, id: img.fileId }
    })

    if(!req.user) return res.status(401).json({message: "Unauthorized"})

    const newProduct = await productModel.create({
        title,
        description,
        images: imgs,
        currentPrice: basePrice,
        basePrice,
        creator: req.user._id
    })

    return res.status(201).json({message: "Product created sucessfully !", product: newProduct})

} catch(error){
    console.log(error)

    await Promise.all(images?.map(async (file) => {
        //fileId
        await deletePic(file.fileId)
    }))

    return res.status(500).json({message: "Error while uploading product"})
}
    
}

async function deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    res.send(id)
}

export default {
    getProducts,
    postProduct,
    deleteProduct
}