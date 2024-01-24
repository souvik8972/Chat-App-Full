const express=require("express")
const route =express.Router()
const auth=require("../middleware/authentication")
const chatController=require("../controllers/chatController")


const multerMiddleware=require("../middleware/multer")



const upload = multerMiddleware.multer.array('media',3)




route.get("/messages",auth.authentication,chatController.getGroupMessages)
route.post("/message",auth.authentication,chatController.sendGroupMessage)
route.post("/media",auth.authentication,upload,chatController.sendGroupAttachment)

  
module.exports=route