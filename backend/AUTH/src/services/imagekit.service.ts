import ImageKit from 'imagekit';
import fs from 'fs'
import { config } from "dotenv"

config();

interface Cred {
    privateKey: string,
    publicKey: string,
    endpoint: string
}


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

const imagekit_credentials : Cred = {
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY || "",
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
    endpoint: process.env.IMAGEKIT_URL_ENDPOINT || ""
}

const imagekit = new ImageKit({
    privateKey: imagekit_credentials.privateKey,
    publicKey: imagekit_credentials.publicKey,
    urlEndpoint: imagekit_credentials.endpoint
})


async function uploadPic (localFile: File) {

    const fileBuffer = fs.readFileSync(localFile.path)


    try {

        const pic = await imagekit.upload({
            file: fileBuffer,
            fileName: localFile.filename,
            folder:"/BidX/profiles"
        })

        fs.unlinkSync(localFile.path)

        return pic;
        
    } catch (error) {
        fs.unlinkSync(localFile.path)
        console.log("Error while uploading the profile picture ", error)
        const profilepic = { url : "https://i.pinimg.com/736x/87/22/ec/8722ec261ddc86a44e7feb3b46836c10.jpg", fileId: "" }
        return profilepic;
    }

}

export {uploadPic};