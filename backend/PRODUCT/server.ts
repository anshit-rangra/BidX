import app from './src/app.ts'
import { config } from "dotenv"
import connectDb from './src/db/db.ts';

config()

const port = Number(process.env.PRODUCT_PORT) as number;

connectDb().then(() => {

    app.listen(port, () => {
        console.log("Product server is running on port ", port);
    })
}).catch(() => {
    process.exit(0)
})