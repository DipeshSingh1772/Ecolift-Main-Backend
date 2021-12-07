const express = require('express')
const Rider = require('../Models/rider')
const auth  = require('../Middleware/auth')
const router = new express.Router()


router.post('/CreateRide', auth , async(req,res)=>{

    const new_ride = new Rider({
        ...req.body,
        owner:req.user._id
    })

    try{

        await new_ride.save()
        res.status(200).send(new_ride);

    }catch(e){

        res.status(400).send("something went wrong")
    }
    
})



//////////////////////////////////////***************************************////////////////////////////
//Delete Request

router.delete('/deleteRide/:id', auth , async(req,res)=>{

    const _id  = req.params.id

    try{

        const ride = await Rider.findOneAndDelete({_id, owner:req.user._id})
        
        if(!ride){
            res.status(201).send('not found')
        }

        res.status(200).send('Deleted')

    }catch(e){

        res.status(400).send(e)

    }

})


////////////////////////////////////////////********************************************/////////////////////////////
//patching operation 

//update task by id
router.patch('/updateRide/:id', auth , async(req,res)=>{

    const updates = Object.keys(req.body)

    const _id = req.params.id

    try{

        const ride  = await Rider.findOne({_id, owner:req.user._id})

        if(!ride){
            return res.status(404).send('not found')
        }

        updates.forEach((update) => ride[update] = req.body[update])
        await ride.save()
        res.send(ride)

    }catch(e){
        res.status(500).send(e)
    }

})





////////////////////////////////***************************************//////////////////////////
//GET request

//reading all task
router.get("/allRide", auth , async(req,res)=>{

    try{

        const ride = await Rider.find({owner : req.user._id})
        res.status(200).send(ride)

    }catch(e){
        res.status(500).send(e)
    }

})


module.exports = router