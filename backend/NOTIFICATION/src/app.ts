import express from "express"
import cors from "cors"
import { connectMQ } from "./broker/broker.ts";
import setListners from "./broker/listners.ts"

const app = express();

app.use(cors({ origin: "*" }))

connectMQ().then(() => {
    setListners()   
})

export default app;