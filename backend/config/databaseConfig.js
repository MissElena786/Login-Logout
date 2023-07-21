const mongoose = require('mongoose')

const MONGODB_URL = process.env.MONGODB_URL   ||  "mongodb://127.0.0.1:27017/Authentication"


// const DBConnect = ()=>{
//    mongoose.connect(MONGODB_URL, {useNewUrlParser : true}).then((conn)=>{
//       console.log(`Connected to DB :`).catch((err)=>{
//          console.log(err, err.message);
//       })
//    })
   
// }




mongoose.connect(MONGODB_URL, {useNewUrlParser : true})
const DBConnect = mongoose.connection;

DBConnect.on("error", function(){
   console.log("mongoDb not connected");
})

DBConnect.once('open', function(){
   console.log("successfully connected with mongoDb");
})


module.exports = DBConnect