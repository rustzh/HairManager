const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,  // 유니크한 값이어야 함
    },
    username: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    refreshtoken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    tableName: 'users', // 테이블명
    timestamps: false,  // createdAt, updatedAt 컬럼을 사용하지 않으면 false로 설정
  }
);



// 사용자 생성
User.createUser = async (email, username, password, refreshtoken) => {
  try {
    const user = await User.create({
      email,
      username,
      password,
      refreshtoken,
    });
    console.log('User created:', user);
  return user;
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};

// 사용자 조회 (이메일로 사용자 찾기)
User.getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    return user;  
  } catch (err) {
    console.error('Error fetching user:', err);

  }
};

// 사용자 조회 (ID로 사용자 찾기)
User.getUserByID = async (id) => {
  try {
    const user = await User.findOne({ where: { id } });
    return user;  
  } catch (err) {
    console.error('Error fetching user:', err);

  }
};

// 사용자 refreshtoken 업데이트
User.updateRefreshTokenByEmail = async (email, newRefreshToken) => {
  try {
    const [updatedRows] = await User.update(
      { refreshtoken: newRefreshToken },
      { where: { email } }
    );
    console.log(updatedRows > 0 ? 'User updated' : 'No user found');
  } catch (err) {
    console.error('Error updating user:', err);
  }
};

// 사용자 refreshtoken 삭제
User.clearRefreshTokenByID = async (id, newRefreshToken = '') => {
  try {
    const [updatedRows] = await User.update(
      { refreshtoken: newRefreshToken }, // 빈 문자열을 넣는 부분
      { where: { id } }
    );
    console.log(updatedRows > 0 ? 'User updated' : 'No user found');
  } catch (err) {
    console.error('Error updating user:', err);
  }
};

// 사용자 삭제 (예시)
User.deleteUser = async (email) => {
  try {
    const deletedRows = await User.destroy({ where: { email } });
    console.log(deletedRows > 0 ? 'User deleted' : 'No user found');
  } catch (err) {
    console.error('Error deleting user:', err);
  }
};
  
module.exports = User;