import type { Request, Response, NextFunction } from "express";
import { config } from "dotenv"
import jwt from "jsonwebtoken"

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

        req.user = { _id: decoded._id }

        next();
        
    } catch (error) {
        res.status(401).json({message: "User is not loggedIn"})
    }

}

export default authMiddleWare;