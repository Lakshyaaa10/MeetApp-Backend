const { kMaxLength } = require('buffer')
const { DataTypes, Sequelize, INTEGER } = require("sequelize");
const sequelize = require("../connection/connection");

const Users = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
    token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    machineId:{
        type:DataTypes.STRING,
        required:true,
        unique:true
    }
    
  });
// sequelize
//   .sync({force:true})
//   .then(() => {
//     console.log("user table created");
//   })
//   .catch((error) => {
//     console.log(error);
//   });



module.exports = Users;