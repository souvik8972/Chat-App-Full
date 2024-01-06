const express=require("express")
const route =express.Router()
const usercontroller=require("../controllers/userController.js")

route.post("/signup",usercontroller.signup)
route.post("/login",usercontroller.login)
route.get("/",(req, res) =>{
    res.sendFile("index.html",{root:"views"})
})

module.exports=route