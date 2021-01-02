const express = require('express');
const router = express.Router()
const requiredLogin = require("../middlewares/requiredLogin")
const postModel = require("../models/post");
const userModel = require('../models/user');


router.get("/user/:id",requiredLogin,(req, res) => {
    userModel.findOne({_id: req.params.id}).select("-password")
        .then((user) => {
            postModel.find({postedBy:user._id})
                .populate("postedBy", "_id name")
                .exec((err, posts) => {
                    if(err){
                        return res.status(422).json({error: err})
                    } else {
                        return res.status(200).json({user,posts})
                    }
                })
        })
        .catch((err) => {
            return res.status(404).json({error: err})
        })
})



router.put("/follow", requiredLogin,(req, res) => {
    userModel.findByIdAndUpdate(req.body.followId, {
        $push: {followers: req.user._id}
    }, {
        new: true
    })
        .then(result1 => {
            userModel.findByIdAndUpdate(req.user._id, {
                $push: {following: req.body.followId}
            }, {new: true})
                .then(result => {
                    return res.status(200).json({profile: result, user: result1})
                })
                .catch((err) => {
                    return res.status(404).json({err})
                })
        })
        .catch((err) => {
            return res.status(404).json({err})
        })
})


router.put("/unfollow", requiredLogin,(req, res) => {
    userModel.findByIdAndUpdate(req.body.unfollowId, {
        $pull: {followers: req.user._id}
    }, {
        new: true
    })
        .then(result1 => {
            userModel.findByIdAndUpdate(req.user._id, {
                $pull: {following: req.body.unfollowId}
            }, {new: true})
                .then(result => {
                    return res.status(200).json({profile: result, user: result1})
                })
                .catch((err) => {
                    return res.status(404).json({err})
                })
        })
        .catch((err) => {
            return res.status(404).json({err})
        })
})

router.put("/uploadPic", requiredLogin, (req, res) => {
    userModel.findByIdAndUpdate(req.user._id, {
        $set: {picUrl: req.body.picURL}
    }, {
        new: true
    })
        .then(result => {
            return res.status(201).json({result})
        })
        .catch((err) => {
            return res.status(422).json({err})
        })
})

module.exports = router