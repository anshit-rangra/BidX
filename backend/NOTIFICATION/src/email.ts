import nodemailer from "nodemailer"
import { config } from "dotenv"
config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
    }
})

transporter.verify((error, success) => {
    if(error) {
        console.log("Error connecting to email server: ", error)
    } else {
        console.log("Email server is ready to send messages")
    }
})


export async function sendEmail(to: string, subject: string, text: string, html: string) {
    try {

        await transporter.sendMail({
            from:  `Anshit Rangra <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html
        })
        
    } catch (error) {
        console.log("Error sending email => ", error)
    }
}