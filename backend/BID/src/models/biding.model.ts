import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }, 
    bidder: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    from: {
        type: Number,
        required: true
    },
    to: {
        type: Number,
        required: true
    }
}, { timestamps: true })

const bidModel = mongoose.model("bids", bidSchema)

export default bidModel;