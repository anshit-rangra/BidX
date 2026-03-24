import app from "./src/app.ts"
import { config } from "dotenv";

config();

const port: number = Number(process.env.NOTIFICATION_PORT) as number;

app.listen(port, () => {
    console.log("Notification service is running on port ", port)
})