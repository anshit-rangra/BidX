import { sendEmail } from "../email.ts";
import { subscribeToQueue } from "./broker.ts";


export default async function () {
    subscribeToQueue("AUTH_NOTIFICATION.USER_CREATED", async (data: {name: string, email: string}) => {
        const emailHTMLTemplate = `
        <h1>Welcome to BidX</h1>
        <p>Dear ${data.name},</p>
        <p>Thank you for registration</p>
        <p>Best Regards, <br/> Team BidX </p>
        `

        await sendEmail(data.email, "Welcome", "Thankyou for registering with us", emailHTMLTemplate)
    })
}