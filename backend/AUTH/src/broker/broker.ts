import amqplib from "amqplib"
import { config } from "dotenv"

config()

let channel: any , connection: any;

export async function connectMQ() {
try {
    if(connection) return connection;

    connection = await amqplib.connect(process.env.RABBIT_MQ as string)

    console.log("Connected to RabbitMQ")

    channel = await connection.createChannel();
} catch (error) {
    console.log("Error connection with RabbitMQ", error)
    }
}

export async function publishToQueue(queueName: string, data={}) {
    if(!channel || !connection) await connectMQ();

    await channel.assertQueue(queueName, { durable: true })

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)))

    // console.log("Message send to Queue", queueName, data)
}

export async function subscribeToQueue(queueName: string, callback: any) {
    if(!channel || !connection) await connectMQ()

    await channel.assertQueue(queueName, { durable: true })

    channel.consume(queueName, async (msg: {content: Buffer}) => {
        if(msg!= null){
            const data = JSON.parse(msg.content.toString())
            await callback(data)
            channel.ack(msg)
        }
    })
}
