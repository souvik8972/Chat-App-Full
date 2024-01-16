const Sequelize = require('sequelize');
const sequelize = require('../util/db');
const UserMessage=sequelize.define("OldMessage",{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true,
        allowNull: false,
    },
    
    message:{
        type:Sequelize.STRING,
        allowNull: false
    },
    isMedia:{
        type:Sequelize.BOOLEAN,
        defaultValue : false

    },
    username:{
        type:Sequelize.STRING,
        allowNull: false

    },userId:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },groupId:{
        type: Sequelize.INTEGER,
        allowNull: false,
    }

});



module.exports=UserMessage