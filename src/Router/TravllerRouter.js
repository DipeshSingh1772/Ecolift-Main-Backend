const express = require('express')
const Travller = require('../Models/travller')
const auth  = require('../Middleware/auth')
const router = new express.Router()


router.post('/CreateTravller', auth , async(req,res)=>{

    const new_travller = new Travller({
        ...req.body,
        owner:req.user._id
    })

    try{

        await new_travller.save()
        res.status(200).send(new_travller);

    }catch(e){

        res.status(400).send("something went wrong")
    }
    
})



//////////////////////////////////////***************************************////////////////////////////
//Delete Request

router.delete('/deleteTravller/:id', auth , async(req,res)=>{

    const _id  = req.params.id

    try{

        const travller = await Travller.findOneAndDelete({_id, owner:req.user._id})
        
        if(!travller){
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
router.patch('/updateTravller/:id', auth , async(req,res)=>{

    const updates = Object.keys(req.body)

    const _id = req.params.id

    try{

        const travller  = await Travller.findOne({_id, owner:req.user._id})

        if(!travller){
            return res.status(404).send('not found')
        }

        updates.forEach((update) => travller[update] = req.body[update])
        await travller.save()
        res.send(travller)

    }catch(e){
        res.status(500).send(e)
    }

})





////////////////////////////////***************************************//////////////////////////
//GET request

//reading all travller
router.get("/allTravller", auth , async(req,res)=>{

    try{

        const travller = await Travller.find({owner : req.user._id})
        res.status(200).send(travller)

    }catch(e){
        res.status(500).send(e)
    }

})


module.exports = router