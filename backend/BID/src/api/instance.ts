import axios from "axios";
import { config } from "dotenv"

config();

const productService: string = process.env.PRODUCT_SERVICE as string;

export const productCallInstance = axios.create({
    baseURL: productService,
    withCredentials: true
})