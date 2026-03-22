import type { NextFunction, Request, Response } from "express"
import { z } from "zod"

const userValidations = z.object({
    name: z
    .string()
    .trim()
    .min(2,"Name should be minimun two characters"),

    email: z
    .email()
    .trim(),

    password: z
    .string()
    .trim()
    .min(6, "The password should be minimun 6 characters long")
})

async function validatorMiddleware(req: Request, res: Response, next: NextFunction) {

    try {

        const { name, email, password } = req.body;

        req.body = {name: name.trim(), email: email.trim(), password: password.trim()}

        userValidations.parse(req.body)
        next()
    } catch (error: any) {
        const message = JSON.parse(error.message)
        res.status(400).json({message: message[0].message})
    }

}

export default validatorMiddleware;