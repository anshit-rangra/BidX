import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod'

const productValidation = z.object({
    title: z
    .string()
    .trim()
    .max(75, "Title must be less than 75 characters"),

    description: z
    .string()
    .trim()
    .max(2000, "Description must be less than 2000 characters"),

    basePrice: z
    .number()
})


async function validatorMiddleware(req: Request, res: Response, next: NextFunction) {

    try {

        const { title, description, basePrice } = req.body;

        req.body = {title: title.trim(), description: description.trim(), basePrice: Number(basePrice)}

        productValidation.parse(req.body)
        next()
    } catch (error: any) {
        const message = JSON.parse(error.message)
        res.status(400).json({message: message[0].message})
    }

}

export default validatorMiddleware;