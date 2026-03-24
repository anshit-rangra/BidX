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
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY as string,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
    endpoint: process.env.IMAGEKIT_URL_ENDPOINT as string
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
            folder:"/BidX/products"
        })

        fs.unlinkSync(localFile.path)

        return pic;
        
    } catch (error) {
        fs.unlinkSync(localFile.path)
        console.log("Error while uploading the profile picture ", error)
    }

}

async function deletePic (fileId: string){ 
    return imagekit.deleteFile(fileId, function(error, result) {
  if (error) {
    console.log("Error:", error);
  } else {
    console.log("Deleted:", result);
  }
});
}

export {uploadPic, deletePic};