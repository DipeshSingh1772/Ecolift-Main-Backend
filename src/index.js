const express  = require('express')
const UserRoutes = require('./Router/UserRouter')
const TravllerRouter = require('./Router/TravllerRouter')
const RiderRouter = require('./Router/RiderRouter')
require('./Database/EcoliftDb')
const app = express()

app.use(express.json());

const port = process.env.PORT || 3000 

app.use(UserRoutes)
app.use(TravllerRouter)
app.use(RiderRouter)

app.listen(port, (req,res) => {                //starting server from express js
    console.log('server is up ' + port)
})