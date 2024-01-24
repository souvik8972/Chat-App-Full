const express=require("express")
const route =express.Router()
const authentication=require("../middleware/authentication")
const groupController=require("../controllers/groupController")

const usercontroller=require("../controllers/userController.js")



route.get("/group",authentication.authentication,groupController.getGroupId)
route.post("/group/create",authentication.authentication,groupController.createGroup)
route.get("/groups",authentication.authentication,groupController.getMygroups)
route.put("/group/update",authentication.authentication,groupController.updateGroup)
route.delete("/group/exit",authentication.authentication,groupController.exitGroup)
route.get("/users",authentication.authentication,usercontroller.getAllUsers)


module.exports =route