const { json } = require('express');
const express = require('express');
const router = express.Router()
const requiredLogin = require("../middlewares/requiredLogin")
const postModel = require("../models/post");
const { populate } = require('../models/user');
const userModel = require('../models/user');


// mongo error handling
const handleErrors = (err) => {
    let errors = { title: "", body: "", photo: ""}
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
    const { title, body, photo } = req.body
    try{
        req.user.password = undefined
        const post = await postModel.create({
            photo: photo,
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


// get route for follower's post
router.get("/myFollowers", requiredLogin,async (req, res) => {
    try {
        const posts = await postModel.find({postedBy: {$in: req.user.following}}).populate("postedBy", "_id name picUrl").sort("-createdAt")
        return res.status(200).json({posts})
    } catch (error) {
        return res.status(422).json({error: error})
    }
})
// get route to view all posts
router.get("/posts", requiredLogin, async (req, res) => {
    try{
        const posts = await postModel.find().populate("postedBy", "_id name picUrl").sort("-createdAt")
        res.status(200).json({posts})
    }
    catch(err){
        console.log(err)
    }
})

// delete route for post
router.delete("/delete", requiredLogin, async (req, res) => {
    postModel.findByIdAndDelete(req.body.postId)
        .then((result) => {
            return res.status(200).json({post:result})
        })
        .catch((err) => {
            return res.status(422).json({error: err})
        })
})
// get route for my post
router.get("/myposts", requiredLogin, async (req, res) => {
    try{
        const posts = await postModel.find({postedBy: req.user._id}).populate("postedBy", "_id name").sort("-createdAt")
        res.status(200).json({posts})
    }
    catch(err){
        res.status(422).json({error: "you must be signed in."})
    }
})


// route for like and unlike
router.put("/like", requiredLogin, (req, res) => {
    postModel.findByIdAndUpdate(req.body.postId, {
        $push:{likes:req.user._id}
    }, {
        new: true
    }).populate("postedBy", "_id name picUrl").exec((err, data) => {
        if(err){
            return res.status(422).json({error:err})
        } else{
            return res.status(200).json(data)
        }
    })
})
router.put("/dislike", requiredLogin, (req, res) => {
    postModel.findByIdAndUpdate(req.body.postId, {
        $pull:{likes:req.user._id}
    }, {
        new: true
    }).populate("postedBy", "_id name picUrl").exec((err, data) => {
        if(err){
            return res.status(422).json({error:err})
        } else {
            return res.json(data)
        }
    })
})
module.exports = router