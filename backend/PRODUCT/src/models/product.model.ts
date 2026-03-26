import mongoose from "mongoose";


const productPicSchema = new mongoose.Schema({

        url: {
            type: String,
            required: true,
        },
        id: {
            type: String,
            default: ""
        }

})


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true, 
    },
    images: {
        type: [productPicSchema],
    },
    
    currentPrice: {
        type: Number, 
        required: true
    },
    
    basePrice: {
        type: Number,
        required: true
    },

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    bidder: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    timeline: {
        type: String,
        required: true
    },

    completed: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

const productModel = mongoose.model("products", productSchema)

export default productModel