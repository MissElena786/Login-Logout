const express = require('express')
const routs = express.Router()
const {Signup, Signin, getUser,logout, forgotPassword, resetPassword} = require('../controller/controllers')
const jwtAuth= require("../middelware/jwtAuth")


routs.post('/signup', Signup )
routs.post('/signin', Signin )
routs.get('/user',jwtAuth, getUser )
routs.get('/logout',jwtAuth, logout )
routs.post('/forgotPass',jwtAuth, forgotPassword )
routs.post('/resetPass',jwtAuth, resetPassword)

module.exports = routs