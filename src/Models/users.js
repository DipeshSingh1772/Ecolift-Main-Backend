const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Travller = require("./travller")
const Rider = require("./rider")


const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true
    },
    mobile:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        lowercase:true,
        required:true,
        validate(value){
            
            if(!validator.isEmail(value))
                throw new Error('email is not valid')
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){

            if(value==='password')
                throw new Error('password is invalid')
        }
    },
    tokens:[{

        token:{
            type:String,
            required:true
        }
    }]


})


//relation between user and tasks
userSchema.virtual('Travller', {

    ref:'travller',                        //same typed name of tasks model in tasks.js
    localField:'_id',
    foreignField:'owner'
})

//relation between user and tasks
userSchema.virtual('Rider', {

    ref:'rider',                        //same typed name of tasks model in tasks.js
    localField:'_id',
    foreignField:'owner'
})


///////////////////////////************************************************* *////////////////////////////




//remove password and tokens from response 
userSchema.methods.toJSON =  function (){

    const user = this
    
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    
    return userObject
}

//generating auth token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisisecolift')

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
};


userSchema.statics.findByCredential = async function(email, password){

    const user = await User.findOne({email})
    if(!user){
        throw new Error('User Not Found')
    }

    const isMatch  = await bcrypt.compare(password, user.password)

    if(!isMatch)
        return('Wrong Credential')

    return user

}

//hash plain password
userSchema.pre('save', async function(next){

    const user = this

    if(user.isModified('password')){

        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


//deleting all tasks when user delete profile
userSchema.pre('remove', async function(next){

    const user = this
    await Travller.deleteMany({owner:user._id})
    await Rider.deleteMany({owner:user._id})
    next()
})



const User = mongoose.model('users', userSchema)

module.exports = User