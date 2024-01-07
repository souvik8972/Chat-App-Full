const sequelize = require("../util/db");
const ChatHistory = require("../models/ChatHistory");
const User = require("../models/userDb");
const Group = require("../models/groupDb");

exports.createGroup = async (req, res) => {
    const user = req.user;
    console.log(user)
    try {
        
        const { name, membersNo, membersIds } = req.body;

        const group = await user.createGroup({
            name: name,
            membersNo: membersNo,
            AdminId: user.id
        });

        // Adding the current user to membersIds
        membersIds.push(user.id);

        // Adding selected users to GroupMembers
        await group.addUsers(membersIds.map((ele) => Number(ele)));

        return res.status(201).json({ group, message: "Group Created" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to create Group', error: error.message });
    }
};

exports.getAllGroups=async(req,res)=>{
    try {
        const groups = await Group.findAll();
        res.status(200).json({ groups})
    } catch (error) {
        
        res.status(500).json({ message: 'Failed to get groups', error})
    }
}