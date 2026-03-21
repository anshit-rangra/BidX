import crypto from 'crypto'
import type { Request, Response } from "express";
import { uploadPic } from "../services/imagekit.service.ts";
import userModel from "../models/user.model.ts";
import jwt from "jsonwebtoken"
import { config } from "dotenv"

config();



async function home(req: Request, res: Response) {
    
    res.status(200).json({message: "Hello world"})
}

async function registration(req: Request, res: Response) {

    const { name, email, password } = req.body;

    const userExists = await userModel.findOne({ email });

    if(userExists) return res.status(409).json({message: "User is already exists"})

    let profilePic: { url: string, fileId: string };
    if(req.file){
    profilePic = await uploadPic(req.file)

    } else {
        profilePic = { url : "https://i.pinimg.com/736x/87/22/ec/8722ec261ddc86a44e7feb3b46836c10.jpg", fileId: "" }
    }

    const hashPassword = crypto.createHash('sha256').update(password).digest('hex');

    try {

    const newUser = await userModel.create({
        name: name, 
        email: email,
        password: hashPassword,
        profile: {
            profilePic: profilePic.url,
            profilePicId: profilePic.fileId
        }
    })

    
    const refreshToken = jwt.sign({
        _id: newUser._id 
    }, process.env.JWT_SECRET as string, {
        expiresIn: "7d"
    })

    const accessToken = jwt.sign({
        _id: newUser._id
    }, process.env.JWT_SECRET as string, {
        expiresIn: "15m"
    })

    res.cookie("123token321", refreshToken, {
        maxAge: 24 * 60 * 60 * 7 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })


    res.status(201).json({message: "New user created", user: newUser, token: accessToken})

    } catch (error){
        res.status(500).json({message: "Internal server error"})
    }
}

async function login(req: Request, res: Response) {

    const { email, password } = req.body;

    const userExists = await userModel.findOne({ email }).select("+password")
    if(!userExists) return res.status(404).json({message: "User is not registered"})

    const hashPassword = crypto.createHash('sha256').update(password).digest('hex')

    if(hashPassword !== userExists.password) return res.status(401).json({message: "Invalid credentials"})

     const refreshToken = jwt.sign({
        _id: userExists._id 
    }, process.env.JWT_SECRET as string, {
        expiresIn: "7d"
    })

    const accessToken = jwt.sign({
        _id: userExists._id
    }, process.env.JWT_SECRET as string, {
        expiresIn: "15m"
    })

    res.cookie("123token321", refreshToken, {
        maxAge: 24 * 60 * 60 * 7 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })


    res.status(201).json({message: "New user created", token: accessToken})
}

async function refreshToken(req: Request, res: Response) {
    
}

export default {
    home, 
    registration,
    login,
    refreshToken
}