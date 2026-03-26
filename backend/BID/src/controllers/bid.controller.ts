import type { Request, Response } from "express";
import { BidOnProductCall } from "../api/product.api.ts";
import bidModel from "../models/biding.model.ts";


async function bidOnProduct(req: Request, res: Response) {
    const id = req.params.id as string;
    const bid = req.query.bid as string;
    const price = Number(req.query.price)
    const accessToken: string = req.headers.authorization?.split(" ")[1] || ""

    try {
        const product = await BidOnProductCall(id, bid, accessToken);

        const bidInstance = await bidModel.create({
            product: id,
            bidder: req.user?._id,
            from: price,
            to: product.product.currentPrice
        })

        res.status(201).json({message: product.message, bid: bidInstance})
        
    } catch (error) {
        res.status(500).json({message: "Internal Server error"})
    }
}

export default { 
    bidOnProduct
}