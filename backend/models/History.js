const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

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
      type: DataTypes.STRING(3),
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

// 결과 저장 (Histroy 인스턴스 생성)
History.createHistory = async (userId,typeCode, imageUrl) => {
    try {
      const history = await History.create({
        userId: userId,
        typeCode: typeCode,
        imageUrl: imageUrl,
      });
      console.log('결과가 저장되었습니다. ', history);
    return history;
    } catch (err) {
      console.error('결과 저장 실패: ', err);
      throw err;
    }
};

// 결과 조회 (userID로 결과 찾기)
History.getHistoryById = async (userId) => {
    try {
      const histories = await History.findAll({
        where: {
          userId: userId
        },
        order: [['createdAt', 'DESC']]
      });
      return histories;  
    } catch (err) {
      console.error('결과 조회 실패: ', err);
      throw err;
    }
  };
  

module.exports = History;