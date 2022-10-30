const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/ZerozillaDB'

const mongoConnect = ()=>{
    mongoose.connect(mongoURI,async ()=>{
        console.log("Connected to Database")
    })
}

module.exports = mongoConnect