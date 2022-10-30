const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://rakeshssk:rakesh%40123@cluster0.gzcnhll.mongodb.net/ZerozillaDB'

const mongoConnect = ()=>{
    mongoose.connect(mongoURI,async ()=>{
        console.log("Connected to Database")
    })
}

module.exports = mongoConnect