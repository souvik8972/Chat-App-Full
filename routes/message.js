const express=require("express")
const route =express.Router()
const auth=require("../middleware/authentication")
const messageController=require("../controllers/messageController")


route.post("/message",auth.authentication,messageController.sendMessage)





module.exports=route