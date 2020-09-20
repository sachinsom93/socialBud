const mongoose = require("mongoose")
const URI = process.env.MONGO_URI

mongoose.connect(URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    (err) => {
    if(!err)
    {
        console.log(`MongoDB is connected...`)
    }
    else{
        console.log(`Error occured during mongo connection: ${err}`)
    }
})