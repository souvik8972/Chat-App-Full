const express=require("express")
const route =express.Router()
const usercontroller=require("../controllers/userController.js")
const authentication=require("../middleware/authentication.js")

route.post("/signup",usercontroller.signup)
route.post("/login",usercontroller.login)
route.get("/",(req, res) =>{
    res.sendFile("index.html",{root:"views"})
})

route.get("/allUsers",authentication.authentication,usercontroller.getAllUsers)

module.exports=route