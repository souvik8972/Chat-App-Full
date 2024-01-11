const express=require("express")
const route =express.Router()
const auth=require("../middleware/authentication")
const messageController=require("../controllers/messageController")


route.post("/message",auth.authentication,messageController.sendMessage)

route.get("/message",auth.authentication,messageController.reciveMessage)

route.get("/dashboard",messageController.getDashboard)

route.get("/GroupMessage",auth.authentication,messageController.getGroupMessage)
route.post("/GroupMessage",auth.authentication,messageController.sendGroupMessage)


module.exports=route