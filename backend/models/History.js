const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
// const FaceType = require('./FaceType');

const History = sequelize.define('History', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    typeCode: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
    // FOREIGN KEY (userId) REFERENCES Users(id)
  }, {
    tableName: 'histories', // 테이블명
    timestamps: false,  // createdAt, updatedAt 컬럼을 사용하지 않으면 false로 설정
  }
);

module.exports = History;