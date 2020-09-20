const express = require('express')
const router = express.Router()
const userModel = require("../models/user")

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

router.post("/signin", async (req, res) => {
    const { name, email, password } = req.body


    // create a new user if we didn't find any error
    try{
        const user = await userModel.create({ name, email, password })
        res.status(201).json(user)
    }    
    catch(err){
        const errors = handleErrors(err)
        res.status(422).json(errors)
    }
})




module.exports = router