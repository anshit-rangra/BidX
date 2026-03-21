import mongoose from "mongoose";


const profilePicSchema = new mongoose.Schema({

        profilePic: {
            type: String,
            required: true,
        },
        profilePicId: {
            type: String,
            default: ""
        }

})


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },

    profile: profilePicSchema,

    money: {
        type: Number,
        default: 0
    }

})

const userModel = mongoose.model("users", userSchema)

export default userModel;