const express=require("express")
const route =express.Router()
const usercontroller=require("../controllers/userController.js")

route.post("/signup",usercontroller.signup)
route.post("/login",usercontroller.login)


module.exports=route