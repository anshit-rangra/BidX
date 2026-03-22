import express from "express"
import { connectMQ } from "./broker/broker.ts";
import setListners from "./broker/listners.ts"

const app = express();

connectMQ().then(() => {
    setListners()   
})

export default app;