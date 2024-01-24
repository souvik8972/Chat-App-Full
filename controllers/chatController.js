const sequelize = require("../util/db");

const User = require("../models/UserDb");
const { Op } = require("sequelize");
const GroupMember = require("../models/GroupMember");
const ChatDb = require("../models/ChatHistory");
const getContentType = require("../util/getContentType");

// Importing AWS service for uploading media to S3
const awsService = require("../services/aws");

exports.sendGroupAttachment = async (req, res) => {
  const user = req.user;

  try {
    const { groupId, text } = req.body;

    // console.log(groupId,text)
    // console.log(req.files)
    const attachmentFiles = req.files;

    // Process each file
    const createdMessages = await Promise.all(
      attachmentFiles.map(async (media) => {
        // Generating a unique filename for the uploaded media
        const filename = `chat-Media/group${groupId}/user${
          user.id
        }/${Date.now()}_${media.originalname}`;
        const attachmentType = getContentType(filename);
        // Uploading the media to AWS S3
        const attachmentUrl = await awsService.uploadToS3(
          media.buffer,
          filename
        );

        await ChatDb.create({
          text,
          attachment: attachmentUrl,
          attachmentType,
          groupId,
          userId: user.id,
          username: user.username,
        });
      })
    );

    // Sending a success response
    res.status(201).json({ message: "Successfully uploaded" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// Controller function for rendering the dashboard HTML page
exports.getDashboard = (req, res) => {
  res.sendFile("dashboard.html", { root: "views" });
};

// Controller function for getting group messages based on group ID
exports.getGroupMessages = async (req, res) => {
  const user = req.user;

  try {
    const { groupId } = req.query;

    // Checking if the user is a member of the group
    const userCount = await GroupMember.count({
      where: {
        userId: user.id,
        groupId,
      },
    });

    // If the user is not a member of the group, return an error response
    if (userCount < 1) {
      return res
        .status(404)
        .json({ message: "You are not allowed to get messages from here" });
    }

    // Fetching all messages for the specified group from the database
    const groups = await ChatDb.findAll({
      where: {
        groupId
      },
    });

    // Finding the ID of the last message in the group
    const lastMessageId =
      groups.length > 0 ? groups[groups.length - 1].id : null;

    // Sending a success response with the group messages and the ID of the last message
    res.status(200).json({ groups, lastMessageId: lastMessageId });
  } catch (error) {
    // Handling errors and sending an error response
    res.send(error);
  }
};

// Controller function for sending a group text message
exports.sendGroupMessage = async (req, res) => {
  const user = req.user;

  try {
    const { message, groupId } = req.body;

    // Checking if the user is a member of the group
    const userCount = await GroupMember.count({
      where: {
        userId: user.id,
        groupId,
      },
    });

    // If the user is not a member of the group, return an error response
    if (userCount < 1) {
      return res
        .status(404)
        .json({ message: "You are not allowed to send messages here" });
    }

    // Creating a new message in the database
    const createdMessage = await ChatDb.create({
      text: message,
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
