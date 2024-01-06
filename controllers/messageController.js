const sequelize = require("../util/db");
const MessageDb = require("../models/userMessage");
const User = require("../models/userDb");

exports.sendMessage = async (req, res) => {
  const user = req.user;


  try {
    const { message } = req.body;

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