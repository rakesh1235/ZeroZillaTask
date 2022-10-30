const mongoose = require('mongoose')
const {Schema} = mongoose;

const ClientSchema = new Schema({
    ClientId:{
        type:Number,
        required:true,
    },
    AgencyId:{
        type:Number,
        required:true
    },
    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    PhoneNumber:{
        type:Number,
        required:true
    },
    TotalBill:{
        type:Number,
        required:true
    },
})

const Client = mongoose.model('client', ClientSchema);
Client.createIndexes();

module.exports = Client;