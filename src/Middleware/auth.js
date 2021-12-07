const Users = require('../Models/users')
const jwt = require('jsonwebtoken')


//for authentication middleware function
const auth = async (req,res,next)=> {

    try{
        
        const token = req.header('Authorization').replace('Bearer ','')
        const decode = jwt.verify(token , 'thisisecolift')    
        const user = await Users.findOne({ _id:decode._id, 'tokens.token':token })  //find that id which have token id is equal to tokens.token in mongodb
        
        if(!user)
            throw new Error()

        req.token = token
        req.user = user

        next()

    }catch(e){
        res.status(401).send({ error :'Please Authenticate'})
    }

}


module.exports = auth