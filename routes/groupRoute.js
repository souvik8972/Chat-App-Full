const express=require("express")
const route =express.Router()
const auth=require("../middleware/authentication")
const groupController=require("../controllers/groupController")





route.get("/getGroupById",auth.authentication,groupController.getGroupId)

route.post("/createGroup",auth.authentication,groupController.createGroup)

route.get("/getAllGroups",auth.authentication,groupController.getAllGroups)
route.get("/getMyGroups",auth.authentication,groupController.getMygroups)





module.exports =route