require('dotenv').config()
const mongoose = require('mongoose')
const URI = process.env.MONGODB_URI

mongoose.connect(URI)
.then(()=>{
    console.log('Connected to the database successfuly')
})
.catch((error)=>{
    console.log('Connection to the database failed', error.message)
})