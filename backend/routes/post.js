const express = require('express');
const router = express.Router()
const requiredLogin = require("../middlewares/requiredLogin")
const postModel = require("../models/post");
const userModel = require('../models/user');


// mongo error handling
const handleErrors = (err) => {
    let errors = { title: "", body: ""}
    // validate errors
    if(err.message.includes("post validation failed"))
    {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        })
    }
    return errors
}

// post route to create new post
router.post("/create",requiredLogin , async (req, res) => {
    const { title, body } = req.body
    try{
        req.user.password = undefined
        const post = await postModel.create({
            title: title, 
            body: body,
            postedBy: req.user
        })
        res.status(201).json({post: post})
    }
    catch(err){
        const errors = handleErrors(err)
        res.status(422).json(errors)
    }
})

// get route to view all posts
router.get("/posts", async (req, res) => {
    try{
        const posts = await postModel.find().populate("postedBy", "_id name")
        res.status(200).json({posts})
    }
    catch(err){
        console.log(err)
    }
})


// get route for my post
router.get("/myposts", requiredLogin, async (req, res) => {
    try{
        const posts = await postModel.find({postedBy: req.user._id}).populate("postedBy", "_id name")
        res.status(200).json({posts})
    }
    catch(err){
        res.status(422).json({error: "you must be signed in."})
    }
})
module.exports = router