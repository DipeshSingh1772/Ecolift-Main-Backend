const Users = require('../Models/users')
const express = require('express')
const router = new express.Router()
const auth  = require('../Middleware/auth')


//creating users
router.post('/user', async(req,res) => {

    const user = new Users(req.body)        // creating new user from models/users.js/User(function) 

    try{
        
        
        await user.save()
        const token = await user.generateAuthToken()        //generate token in users.js file
        res.status(200).send({user,token})
        
    }catch(e){
        console.log({"error":user})
        if(user)
            res.status(400).send('User Already Exist')
        else
            res.status(500).send(e)
    }

})

//login user
router.post('/Login' , async(req,res) => {

    try{
        const user = await Users.findByCredential(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.status(200).send({user, token})

    }catch(e){

        res.status(400).send('Invalid id or Password')
    }

})

// logout 
router.post('/Logout', auth , async(req,res) => {


    try{

        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })

        await req.user.save()

        res.status(200).send('Logout')

    }catch(e){
            res.status(500).send(e)
    }
})

//Logout all session
router.post('/logoutall', auth , async(req,res)=>{

    try{

        req.user.tokens = []

        await req.user.save()

        res.send('Logout All Session')
    
    }catch(e){
        res.status(500).send(e)
    }


})


/////////////////////////////////////////***********************************////////////
//GET request
//User Profile
router.get('/profile', auth , async(req,res)=>{

        res.status(200).send(req.user)
})




//////////////////////////////**************************************////////////////////////
// patch request

//updating users details
router.patch("/Update", auth ,async(req,res)=>{

    const updates = Object.keys(req.body)

    try{


        updates.forEach((update)=>{
            req.user[update] = req.body[update]
        })
        await req.user.save()

        res.status(200).send(req.user)

    }catch(e){
        console.log(e)
        res.status(500).send(e)
        
    }

})


//////////////////////////////**************************************////////////////////////
// deleter request

//for deleting user details
router.delete("/deactivate", auth ,  async(req,res)=>{

    try{
        
        await req.user.remove()
        res.status(200).send("User Deleted") 

    }catch(e){
        res.status(500).send(e)
    }

})





module.exports = router
