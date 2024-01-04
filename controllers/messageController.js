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
      userId: user.id, //  userId foreign key in the MessageDb model
    });

    res.send("success");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
