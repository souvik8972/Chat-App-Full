const sequelize = require("../util/db");
const MessageDb = require("../models/ChatHistory");
const User = require("../models/userDb");
const { Op } = require("sequelize");
const GroupMembers=require("../models/group-members")
 
exports.sendGroupMessage = async (req, res) => {
  const user = req.user;


  try {
    


    const { message,groupId } = req.body;
    // if (!groupId){
    //   const createdMessage = await MessageDb.create({
    //     message,
    //     groupId:0,
    //     username: user.username,
    //     userId: user.id, //  userId foreign key in the MessageDb model
    //   });
    //   return res.send("successfully create");

    // }
    const userCount = await GroupMembers.count({
      where: {
        userId: user.id,
        groupId: groupId,
      },
    });
    // console.log(userCount);
    if(userCount<1){
      return res.status(404).json({"message":"you are not allowed  to send msg here "})
    }
    //  user has a relationship with messages (one-to-many)
    const createdMessage = await MessageDb.create({
      message,
      groupId,
      username: user.username,
      userId: user.id, //  userId foreign key in the MessageDb model
    });

    res.send("successfully create");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};



exports.reciveMessage=async(req,res)=>{

  const user=req.user;
  try {
    if(user){
    const rawMessages=await MessageDb.findAll(
      {
        attributes: ['userId', 'message',"username","createdAt"],
      }
    )
    
    res.status(200).json({ rawMessages });
    }else{
      res.send("404")
    }
  } catch (error) {
    res.send(505)
    
  }
    
}


exports.getDashboard=(req,res)=>{
  res.sendFile("dashboard.html",{root:"views"})
  
}

exports.sendMessage = async (req, res) => {
  const user = req.user;


  try {
    const { message} = req.body;

    //  user has a relationship with messages (one-to-many)
    const createdMessage = await MessageDb.create({
      message,
    
      username: user.username,
      userId: user.id, //  userId foreign key in the MessageDb model
    });

    res.send("successfully create");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getGroupMessage=async(req,res)=>{
  const user=req.user
  try {
    
    const {groupId} = req.query;


    const userCount = await GroupMembers.count({
      where: {
        userId: user.id,
        groupId: groupId,
      },
    });
    // console.log(userCount);
    if(userCount<1){
      return res.status(404).json({"message":"you are not allowed  to get msg from here "})
    }


    const groups=await MessageDb.findAll({
      where:{
        groupId:groupId,
      }
    })
    const lastMessageId = groups.length > 0 ? groups[groups.length - 1].id : null;
res.status(200).json({groups,lastMessageId:lastMessageId})

    
  } catch (error) {
    res.send(error)
  }

}