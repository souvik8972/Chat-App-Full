const express=require("express")
const route =express.Router()
const usercontroller=require("../controllers/userController.js")
const chatController=require("../controllers/chatController") 

route.post("/signup",usercontroller.signUp)
route.post("/login",usercontroller.login)
route.get("/",usercontroller.homePage)
route.get("/user",usercontroller.getUser)
route.get("/dashboard",chatController.getDashboard)

module.exports=route