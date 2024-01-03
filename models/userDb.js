const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true,
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, 
    },
    phonenumber:{
        type: Sequelize.STRING,
        allowNull: false,
        unique:true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    }
    
  
    
});

module.exports = User;
