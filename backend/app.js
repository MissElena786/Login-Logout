const express = require('express')
const app  = express()
const Routes = require('./Routes/routs')
const cookieParser = require('cookie-parser')
const cors = require('cors')



const DBConnect = require("./config/databaseConfig")

app.use(express.json())
app.use('/api/auth', Routes)
app.use(cookieParser())
app.use(cors({
   origin : [process.env.CLIENT_URL],
   crendentials : true
}))

app.use('/', (req,res)=>{
   res.status(200).json({
      data : 'JWT Auth server'
   })
})

module.exports = app