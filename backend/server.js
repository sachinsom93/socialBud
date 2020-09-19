const express = require("express")
const app = express()
const dotenv = require("dotenv")

// routers
const authRouter = require("./routes/auth") 
// config .env
dotenv.config()

// define port
const PORT = process.env.PORT || 5000

// parse post data
app.use(express.json())
app.use(express.urlencoded({extended: false}))


// require db and models
require("./config/db")
require("./models/user")









// require all routes
app.use(authRouter)


// listen app
app.listen(PORT, (err) => {
    if(err)
    {
        console.log(`Error occured during app listening: ${err}`)
    }
    else{
        console.log(`Server is started on port: ${PORT}`)
    }
})