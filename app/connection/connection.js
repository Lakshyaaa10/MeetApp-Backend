const express = require("express");
const app = express();

const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
    dialect:'mysql',
    host:`localhost`,
    username:`root`,
    password:``,
    database:`xeobit`,
    port:`3306`,
    timezone: '+05:30'
})
sequelize.authenticate().then(() => {
  console.log('database connected');
}).catch((error) => {
  console.error('Error syncing database:', error);
});

module.exports = sequelize;
