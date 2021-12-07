const mongoose = require("mongoose")


const riderSchema = new mongoose.Schema({

    pickup:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    destination:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    date:{
        type:String,
        required:true,
    },
    time:{
        type:String,
        required:true,
    },
    seats:{
        type:String,
        required:true,
    },
    amount:{
        type:String,
        required:true,
        default:0   
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    }


})


const Rider = mongoose.model('rider', riderSchema)

module.exports = Rider