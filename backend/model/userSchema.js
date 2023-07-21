const mongoose = require("mongoose")
const {Schema} = mongoose
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new Schema({
   name:{
      type: String,
      require : [true, "user name is required"],
      maxLength : [40],
      trim : true
   },
   email : {
      type : String,
      riquired : [true, "user email is required"],
      unique : true,
      unique : [true, "already registerd"],
      trim : true

   },
   password :{
      type : String,
      require: [true, "user password is required"]


   },
   forgotPasswordToken : {
      type :String
   },
   forgotPasswordExpiryDate:{
      type: Date
   }
   
},{
   timestamps: true
})

userSchema.pre('save', async function(next){
   if(!this.isModified('password')){
      return next()
   }
   this.password = await bcrypt.hash(this.password, 10)
   return next();
})

userSchema.methods = {
   jwtToken(){
      return JWT.sign({
         id: this._id, email : this.email },
         process.env.SECRET, {expiresIn : '24h'})
   }
}

const userModel = mongoose.model('auth-user', userSchema)
module.exports = userModel