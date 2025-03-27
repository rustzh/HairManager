const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
// const History = require('./History');


const FaceType = sequelize.define('FaceType', {
    typeCode: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
    },
    typeName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    typeDesc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    hairName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    hairDesc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'facetypes', 
    timestamps: false,
  });
  
  module.exports = FaceType;