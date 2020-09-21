const jwt = require('jsonwebtoken');
const userModel = require("../models/user")


module.exports = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]
    if(token == null){
        return res.status(401).json({error: "You must be signed in"})
    }
    else{
        jwt.verify(token, process.env.JWT_SECRET, async (err, payload) =>{
            if(err){
                return res.status(401).json({error: "You must be signed in"})
            }
            else{
                const { id } = payload
                const user = await userModel.findById(id)
                req.user = user
                next()
            }
        })
    }
    
}