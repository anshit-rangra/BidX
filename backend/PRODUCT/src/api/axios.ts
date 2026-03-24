import axios from "axios"
import { config } from "dotenv"

config();

export const authServiceInstance = axios.create({
    baseURL: process.env.AUTH_SERVICE_URI as string,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

