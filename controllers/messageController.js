// Importing necessary modules and models
const sequelize = require("../util/db");
const MessageDb = require("../models/ChatHistory");
const User = require("../models/userDb");
const { Op } = require("sequelize");
const GroupMembers = require("../models/group-members");

// Importing environment variables for AWS S3
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.BUCKET_NAME;

// Importing AWS service for uploading media to S3
const awsService = require("../services/aws");

// Controller function for sending a group text message
exports.sendGroupMessage = async (req, res) => {
  const user = req.user;

  try {
    const { message, groupId } = req.body;

    // Checking if the user is a member of the group
    const userCount = await GroupMembers.count({
      where: {
        userId: user.id,
        groupId: groupId,
      },
    });

    // If the user is not a member of the group, return an error response
    if (userCount < 1) {
      return res.status(404).json({ "message": "You are not allowed to send messages here" });
    }

    // Creating a new message in the database
    const createdMessage = await MessageDb.create({
      message,
      groupId,
      username: user.username,
      userId: user.id,
    });

    // Sending a success response
    res.send("Successfully created");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Controller function for sending a group media message (uploading media to AWS S3)
exports.sendGroupMedia = async (req, res) => {
  const user = req.user;

  try {
    const { groupId } = req.body;
    const media = req.file;

    // Generating a unique filename for the uploaded media
    const filename = `chat-Media/group${groupId}/user${user.id}/${Date.now()}_${media.originalname}`;

    // Uploading the media to AWS S3
    const mediaUrl = await awsService.uploadToS3(media.buffer, filename);

    // Creating a new message in the database with the media URL
    const createdMessage = await MessageDb.create({
      message: mediaUrl,
      groupId,
      isMedia: true,
      username: user.username,
      userId: user.id,
    });

    // Sending a success response
    res.status(201).json({ "message": "Successfully uploaded" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Controller function for receiving all messages
exports.reciveMessage = async (req, res) => {
  const user = req.user;

  try {
    // Fetching all messages from the database
    const rawMessages = await MessageDb.findAll({
      attributes: ['userId', 'message', "username", "createdAt"],
    });

    // Sending a success response with the fetched messages
    res.status(200).json({ rawMessages });
  } catch (error) {
    // Handling errors and sending an error response
    res.send(505);
  }
};

// Controller function for rendering the dashboard HTML page
exports.getDashboard = (req, res) => {
  res.sendFile("dashboard.html", { root: "views" });
};

// Controller function for sending a text message
exports.sendMessage = async (req, res) => {
  const user = req.user;

  try {
    const { message } = req.body;

    // Creating a new message in the database
    const createdMessage = await MessageDb.create({
      message,
      username: user.username,
      userId: user.id,
    });

    // Sending a success response
    res.send("Successfully created");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Controller function for getting group messages based on group ID
exports.getGroupMessage = async (req, res) => {
  const user = req.user;

  try {
    const { groupId } = req.query;

    // Checking if the user is a member of the group
    const userCount = await GroupMembers.count({
      where: {
        userId: user.id,
        groupId: groupId,
      },
    });

    // If the user is not a member of the group, return an error response
    if (userCount < 1) {
      return res.status(404).json({ "message": "You are not allowed to get messages from here" });
    }

    // Fetching all messages for the specified group from the database
    const groups = await MessageDb.findAll({
      where: {
        groupId: groupId,
      }
    });

    // Finding the ID of the last message in the group
    const lastMessageId = groups.length > 0 ? groups[groups.length - 1].id : null;

    // Sending a success response with the group messages and the ID of the last message
    res.status(200).json({ groups, lastMessageId: lastMessageId });

  } catch (error) {
    // Handling errors and sending an error response
    res.send(error);
  }
};
