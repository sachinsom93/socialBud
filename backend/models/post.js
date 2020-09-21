const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please write a title"]
    },
    body: {
        type: String,
        required: [true, "Please provide a discription about your post"]
    },
    photo: {
        type: String,
        default: "No photo"
    },
    postedBy: {
        type: ObjectId,
        ref: "user"
    }
})



const postModel = mongoose.model("post", postSchema)

module.exports = postModel