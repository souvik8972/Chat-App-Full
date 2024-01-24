
const Group = require("../models/GroupDb");



// Controller function for creating a new group
exports.createGroup = async (req, res) => {
    const user = req.user; // Extracting the user from the request 

    try {
        // Extracting necessary information from the request body
        const { name, membersNo, membersIds } = req.body;

        // Creating a new group in the database associated with the current user
        const group = await user.createGroup({
            name,
            membersNo,
            adminId: user.id
        });

        
        membersIds.push(user.id);
        await group.addUsers(membersIds.map((ele) => Number(ele)));

        // Sending a success response with the created group
        return res.status(201).json({  message: "Group Created successfully" });
    } catch (error) {
        
        console.error(error);
        return res.status(500).json({ message: 'Failed to create Group', error: error.message });
    }
};




// // Controller function for getting all groups
// exports.getAllGroups = async (req, res) => {
//     try {
//         // Retrieving all groups from the database
//         const groups = await Group.findAll();

//         // Sending a success response with the list of groups
//         res.status(200).json({ groups });
//     } catch (error) {
//         // Handling errors and sending an error response
//         res.status(500).json({ message: 'Failed to get groups' });
//     }
// }




// Controller function for getting groups associated with the logged-in user
exports.getMygroups = async (req, res, next) => {
    try {
        const user = req.user; 

        // Retrieving groups associated with the user
        const groups = await user.getGroups();

        // Sending a success response with the user's groups
        return res.status(200).json({ groups, message: "All groups successfully fetched" });
    } catch (error) {
        // Handling errors and sending an error response
        console.log(error);
        return res.status(500).json({ message: 'Internal Server error' });
    }
}




// Controller function for getting group information based on group ID
exports.getGroupId = async (req, res) => {
    const groupId = req.query.groupid;

    try {
        // Finding the group in the database based on the provided group ID
        const group = await Group.findOne({
            where: {
                id: groupId
            }
        });

        // Sending a success response with the group information
        res.status(200).json({ group });

    } catch (error) {
        // Handling errors and sending an error response
        res.status(500).json({ message: 'Internal Server error!', error: error });

    }
}




// Controller function for updating group information
exports.updateGroup = async (req, res) => {
    const user = req.user; 
    const { groupId } = req.query; 
    try {
        // Finding the group in the database based on the provided group ID
        const findGroup = await Group.findOne({
            where: { id: groupId }
        });

        // Extracting necessary information from the request body
        const { name, membersNo, membersIds } = req.body;

        // Updating the group information in the database
        const updatedGroup = await findGroup.update({
            name,
            membersNo,
            adminId: user.id
        });

        // Adding the current user to membersIds
        membersIds.push(user.id);

        // Clearing existing group members
        await updatedGroup.setUsers(null);

        // Adding selected users to the GroupMembers association in the group
        await updatedGroup.addUsers(membersIds.map((ele) => Number(ele)));

        // Sending a success response with the updated group
        return res.status(201).json({ updatedGroup, message: "Group updated" });
    } catch (error) {
        // Handling errors and sending an error response
        console.error(error);
        return res.status(500).json({ message: 'Failed to update Group', error: error.message });
    }
};




// Controller function for a user to exit a group
exports.exitGroup = async (req, res) => {
    const user = req.user; // Extracting the user from the request
    const { groupId } = req.query; // Extracting the group ID from the request parameters

    try {
        // Finding the group in the database based on the provided group ID
        const group = await Group.findOne({
            where: { id: groupId }
        });

        // Checking if the user is a member of the group
        const isMember = await group.hasUser(user);

        if (isMember) {
            // Removing the user from the group
            await group.removeUser(user);

            // Decrementing membersNo by 1
            const updatedGroup = await group.update({
                membersNo: group.membersNo - 1
            });

            // Sending a success response
            return res.status(200).json({ message: "Exited the group successfully." });
        } else {
            // Sending a 404 response if the user is not a member of the group
            return res.status(404).json({ message: "User is not a member of the group." });
        }
    } catch (error) {
        // Handling errors and sending an error response
        console.error(error);
        return res.status(500).json({ message: 'Failed to exit the group', error: error.message });
    }
};
