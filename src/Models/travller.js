const mongoose = require('mongoose')


const travllerSchema = mongoose.Schema({

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
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    }


})

const Travller = mongoose.model('travller', travllerSchema)

module.exports = Travller