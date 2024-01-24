const Sequelize = require('sequelize');
const sequelize = require('../util/db');
const UserMessage=sequelize.define("OldMessage",{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true,
        allowNull: false,
    },
    
    text: {
        type: Sequelize.STRING,
        allowNull: false
    },

    attachment: {
        type: Sequelize.STRING,
        allowNull: true 
    },

    attachmentType: {
        type: Sequelize.STRING, 
        allowNull: true 
    },
    userId:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },groupId:{
        type: Sequelize.INTEGER,
        allowNull: false,
    }

    
    
    
    
});



module.exports=UserMessage


