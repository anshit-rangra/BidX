import type { Request, Response, NextFunction } from "express";
import { config } from "dotenv"
import jwt from "jsonwebtoken"
import userModel from "../models/user.model.ts";

config();

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: any;
      };
    }
  }
}

async function authMiddleWare(req: Request, res: Response, next: NextFunction) {
    const accessToken: string = req.headers.authorization?.split(" ")[1] || ""

    try {

        const decoded: any = jwt.verify(accessToken, process.env.JWT_SECRET as string)

        const userExists = await userModel.findOne({ _id: decoded._id })

        if(!userExists) return res.status(404).json({message: "No user found"})

        req.user = { _id: userExists._id }

        next();
        
    } catch (error) {
        res.status(500).json({message: "User is not loggedIn"})
    }

}

export default authMiddleWare;