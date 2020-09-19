const express = require('express')
const router = express.Router()
const userModel = require("../models/user")
const bcrypt = require("bcryptjs")


router.post("/signin", async (req, res) => {
    const {name, email, password} = req.body
    if(!name || !email || !password){
       return res.status(422).json({"error": "Please fill all the details"})
    }
    // check for existing user
    const savedUser = await userModel.findOne({email: email})
    if(savedUser){
       return res.status(422).json({"error": `${email} already exists`})
    }
    // password hashing
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // create new user
    const newUser = new userModel(
        {
            name: name,
            email: email,
            password: hashedPassword
        }
    )
    newUser.save()
     .then((user) => {
         res.status(201).json({"message": `${user.name} successfully signed In`})
     })
     .catch((err) => {
         console.log(err)
     })
})




module.exports = router