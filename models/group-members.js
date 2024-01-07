const Sequelize = require('sequelize');
const sequelize = require('../util/db');
const Groupmember=sequelize.define("GroupMember",{
    id:{
    type:Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
    }
})

module.exports=Groupmember;