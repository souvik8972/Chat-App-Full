const express=require("express")
const route =express.Router()
const auth=require("../middleware/authentication")
const groupController=require("../controllers/groupController")






route.post("/createGroup",auth.authentication,groupController.createGroup)

route.get("/getAllGroups",auth.authentication,groupController.getAllGroups)



module.exports =route