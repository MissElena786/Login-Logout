const userModel = require("../model/userSchema")
const emailValidator = require("email-validator")
const bcrypt = require('bcrypt')

exports.Signup = async (req,res, next)=>{
   const {name, email, password, c_password} = req.body
   console.log(name, email, password, c_password);
   // res.status(200).json({ success : true, status : 200, message : 'this is signup page'})

   if(!name  || !email ||   !password ||  !c_password){
      return res.status(400).json({
         success : false,
         message: "every field is required"
      })
   }

   const validEmail = emailValidator.validate(email)
   if(!validEmail){
      return res.status(400).json({
         status : 400,
         message : "Please provide a valid email id"
      })
   }

   if(!(password == c_password)){
      return res.status(400).json({
         status : 400,
         message : "password in not match"
      })
   }

   try {
      const userInfo = userModel(req.body)
      const result = await userInfo.save()
   
      return res.status(200).json({
         success : true,
         data : result
      })
      
   } catch (e) {

      if(e.code===11000){
         return res.status(400).json({
            success :false,
            message : "Account has been already exists eith this email id"
         }) 
      }
      return res.status(400).json({
         success :false,
         message : e.message
      })
   }
 
}




// sighnin *******************


exports.Signin = async (req,res)=>{
   const {email, password} = req.body;

   if(!email ){
      return res.status(400).json({
         success :false,
         message : "email is required"
      })
   }
   if(!password ){
      return res.status(400).json({
         success :false,
         message : "password is required"
      })
   }


   try {
   
      const user = await userModel.findOne({email}).select('+password')
   
      if(!user || await !(bcrypt.compare(password, user.password ))){
         return res.status(400).json({
            success :false,
            message : "invalid credentials"
         })
      }

      const token = user.jwtToken()
      user.password = undefined

      const cookieOption = {
         maxAge : 24 * 60 * 60 * 1000,
         httpOnly : true
   
      }
   
      res.cookie('token', token, cookieOption)
      res.status(200).json({
         success : true,
         data : user
      })

   } catch (e) {
      return res.status(400).json({
         status : 400,
         success : false,
         message : e.message
      })
   }
   
}


exports.getUser = async (req,res,next)=>{
      const userId = req.user.id;
      try{
         const user = await userModel.findById(userId)
         return res.status(200).json({
            success : true,
            data : user
         })
      }catch(e){
         return res.status(400).json({
            success : false, 
            message :e.message
         })
      }
}


exports.logout = (req,res)=>{
   try {
      const cookieOption = {
         expires : new Date(),
         httpOnly : true
      }
      res.cookie('token', null, cookieOption)
      res.status(200).json({
         success : true,
         message: "Logged Out"
      })
   } catch (e) {
      res.status(400).json({
         success : false,
         message: e.message
   })
}
}



exports.resetPassword = async (req, res, next) => {
   const { token } = req.params;
   const { password, confirmPassword } = req.body;
 
   // return error message if password or confirmPassword is missing
   if (!password || !confirmPassword) {
     return res.status(400).json({
       success: false,
       message: "password and confirmPassword is required"
     });
   }
 
   // return error message if password and confirmPassword  are not same
   if (password !== confirmPassword) {
     return res.status(400).json({
       success: false,
       message: "password and confirm Password does not match ❌"
     });
   }
 
   const hashToken = crypto.createHash("sha256").update(token).digest("hex");
 
   try {
     const user = await userModel.findOne({
       forgotPasswordToken: hashToken,
       forgotPasswordExpiryDate: {
         $gt: new Date() // forgotPasswordExpiryDate() less the current date
       }
     });
 
     // return the message if user not found
     if (!user) {
       return res.status(400).json({
         success: false,
         message: "Invalid Token or token is expired"
       });
     }
 
     user.password = password;
     await user.save();
 
     return res.status(200).json({
       success: true,
       message: "successfully reset the password"
     });
   } catch (error) {
     return res.status(400).json({
       success: false,
       message: error.message
     });
   }
 };
 
exports.forgotPassword = async (req, res, next) => {
   const email = req.body.email;
 
   // return response with error message If email is undefined
   if (!email) {
     return res.status(400).json({
       success: false,
       message: "Email is required"
     });
   }
 
   try {
     // retrieve user using given email.
     const user = await userModel.findOne({
       email
     });
 
     // return response with error message user not found
     if (!user) {
       return res.status(400).json({
         success: false,
         message: "user not found 🙅"
       });
     }
 
     // Generate the token with userSchema method getForgotPasswordToken().
     const forgotPasswordToken = user.getForgotPasswordToken();
 
     await user.save();
 
     return res.status(200).json({
       success: true,
       token: forgotPasswordToken
     });
   } catch (error) {
     return res.status(400).json({
       success: false,
       message: error.message
     });
   }
 };