import crypto from 'crypto'
import type { Request, Response } from "express";
import { uploadPic } from "../services/imagekit.service.ts";
import userModel from "../models/user.model.ts";
import jwt from "jsonwebtoken"
import { config } from "dotenv"
import { publishToQueue } from '../broker/broker.ts';

config();



async function home(req: Request, res: Response) {
    
    res.status(200).json({message: "Hello world"})
}

async function registration(req: Request, res: Response) {

    const { name, email, password } = req.body;

    const userExists = await userModel.findOne({ email });

    if(userExists) return res.status(409).json({message: "User with this email is already exists"})

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

    await publishToQueue("AUTH_NOTIFICATION.USER_CREATED", { name: newUser.name, email: newUser.email})

    
    const refreshToken = jwt.sign({
        _id: newUser._id ,
        token: "refresh"
    }, process.env.JWT_SECRET as string, {
        expiresIn: "7d"
    })

    const accessToken = jwt.sign({
        _id: newUser._id,
        token: "access"
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
        _id: userExists._id ,
        token: "refresh"
    }, process.env.JWT_SECRET as string, {
        expiresIn: "7d"
    })

    const accessToken = jwt.sign({
        _id: userExists._id,
        token: "access"
    }, process.env.JWT_SECRET as string, {
        expiresIn: "15m"
    })

    res.cookie("123token321", refreshToken, {
        maxAge: 24 * 60 * 60 * 7 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })

    res.status(200).json({message: "User logged in successfully", token: accessToken})
}

async function refreshToken(req: Request, res: Response) {

    if(!req.user) return res.status(404).json({message: "No user found"})
    
    const user = await userModel.findOne({ _id : req.user._id })

    if(!user) return res.status(404).json({message:"User not found"})

    const refreshToken = jwt.sign({
        _id: user._id ,
        token: "refresh"
    }, process.env.JWT_SECRET as string, {
        expiresIn: "7d"
    })

    const accessToken = jwt.sign({
        _id: user._id,
        token: "access"
    }, process.env.JWT_SECRET as string, {
        expiresIn: "15m"
    })

    res.cookie("123token321", refreshToken, {
        maxAge: 24 * 60 * 60 * 7 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })
    


    res.status(200).json({message:"Token generated successfully", token: accessToken})
}

async function myAccount(req: Request, res: Response) {
    try {

        if(!req.user) return res.status(404).json({message: "No user found"})

        const user = await userModel.findOne({ _id: req.user._id })

        res.status(200).json({message: "User fetched sucessfully" , user: user })
        
    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }
}

async function logout(req: Request, res: Response) {
    res.clearCookie('123token321')
    res.status(200).json({message: "User logged out sucessfully"})
}

async function googleCallback(req: Request, res: Response) {
    if(!req.user) return res.status(400).json({message: "Unauthorized"})

    const hashedId = crypto.createHash('sha256').update((req.user as any).id).digest('hex')

    const user = await userModel.findOneAndUpdate(
        { email: (req.user as any).emails[0].value },
        {
            name: (req.user as any).displayName,
            email: (req.user as any).emails[0].value,
            password: hashedId,
            profile: {
                profilePic: (req.user as any).photos[0].value
            }
        },
        { upsert: true, returnDocument: 'after' }
    )

    const accessToken = jwt.sign({ _id: user._id, token : "access" }, process.env.JWT_SECRET as string, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ _id: user._id, token : "refresh" }, process.env.JWT_SECRET as string, { expiresIn: '7d'})

    res.cookie("123token321", refreshToken, {
        maxAge: 24 * 60 * 60 * 7 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
    })
        res.json({ message: "User loggedIn sucessfully", token: accessToken });

}

export default {
    home, 
    registration,
    login,
    refreshToken,
    myAccount,
    logout,
    googleCallback
}