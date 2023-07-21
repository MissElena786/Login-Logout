
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 3000

const app= require('../backend/app')

app.listen(PORT,()=>{
   console.log(`server is listning at http://localhost:${PORT}`)
})


