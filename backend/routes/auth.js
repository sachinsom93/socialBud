const express = require('express')
const router = express.Router()
const userModel = require("../models/user")
const jwt = require('jsonwebtoken');

// handle validation errors
const handleErrors = (err) => {
    let errors = { name: "", email: "", password: ""}

    
    // duplicate email error
    if(err.code == 11000 && Object.keys(err.keyValue)[0] == "email")
    {
        errors.email = `Email is already registered`
    }
    // duplicate username
    if(err.code == 11000 && Object.keys(err.keyValue)[0] == "name")
    {
        errors.name = "This username is already choosen"
    }
    // validate errors
    if(err.message.includes("user validation failed"))
    {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    return errors
}

// funtion to crete json web tokens
const createToken = (id) => {
    const SECRET  = process.env.JWT_TOKEN
    const token = jwt.sign({id}, SECRET)
    return token
}


// @Route: 
        // path: /signup
        // method: POST
router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body


    // create a new user if we didn't find any error
    try{
        const user = await userModel.create({ name, email, password })

        res.status(201).json(user._id)
    }    
    catch(err){
        const errors = handleErrors(err)
        res.status(422).json(errors)
    }
})


// @Route: 
//     path: /signin
//     method: POST
router.post("/signin", async (req, res) => {
    const { email, password } = req.body
    try{
        const user = await userModel.login(email, password)
        const token = createToken(user._id)
        res.status(200).json({token: token})
    }
    catch(err){
        res.status(422).json({error: err.message})
    }

})




module.exports = router