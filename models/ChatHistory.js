const Sequelize = require('sequelize');
const sequelize = require('../util/db');
const UserMessage=sequelize.define("userMessage",{
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
    username:{
        type:Sequelize.STRING,
        allowNull: false

    }

});



module.exports=UserMessage