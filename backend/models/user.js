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

// static method for login
userSchema.statics.login = async function(email, password){
    if(!email || !password){
        throw Error("Please enter email or password")
    }
    const user = await this.findOne({email: email})
    if(user){
        const isMatch = await bcrypt.compare(password, user.password)
        if(isMatch){
            return user
        }
        throw Error("Incorrect password")
    }
    throw Error(`${email} is not registered`)
}


const userModel = mongoose.model("user", userSchema)
module.exports = userModel