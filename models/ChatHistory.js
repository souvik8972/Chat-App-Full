const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const UserMessage = sequelize.define("chat", {
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
    username: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = UserMessage;
