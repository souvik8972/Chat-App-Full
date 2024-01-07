const Sequelize = require('sequelize');
const sequelize = require('../util/db');


const Group=sequelize.define('group',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type:Sequelize.STRING(50),
      unique:true,
      notEmpty:true,
    },
    membersNo:{
        type:Sequelize.INTEGER,
        allowNull:false       
    },
    date:{
        type:Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },    
    }

)
module.exports =Group