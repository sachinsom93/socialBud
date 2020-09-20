const mongoose = require("mongoose")
const { isEmail } = require("validator")
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String, 
        required: [true, "Please enter a username"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "Minimum password length is 6 character"]
    }
})

// mongo pre hook to hash the password
userSchema.pre("save",async function (next){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel