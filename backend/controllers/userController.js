const { User } = require("../models");

// 사용자 생성
const createUser = async (email, username, password, refreshtoken) => {
  try {
    const user = await User.create({
      email,
      username,
      password,
      refreshtoken,
    });
    console.log("User created:", user);
    return user;
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
};

// 사용자 조회 (이메일로 사용자 찾기)
const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    return user;
  } catch (err) {
    console.error("Error fetching user:", err);
  }
};

// 사용자 조회 (ID로 사용자 찾기)
const getUserByID = async (id) => {
  try {
    const user = await User.findOne({ where: { id } });
    return user;
  } catch (err) {
    console.error("Error fetching user:", err);
  }
};

// 사용자 refreshtoken 업데이트
const updateRefreshTokenByEmail = async (email, newRefreshToken) => {
  try {
    const [updatedRows] = await User.update(
      { refreshtoken: newRefreshToken },
      { where: { email } }
    );
    console.log(updatedRows > 0 ? "User updated" : "No user found");
  } catch (err) {
    console.error("Error updating user:", err);
  }
};

const updateRefreshTokenByID = async (id, newRefreshToken) => {
  try {
    const [updatedRows] = await User.update(
      { refreshtoken: newRefreshToken }, // 빈 문자열을 넣는 부분
      { where: { id } }
    );
    console.log(updatedRows > 0 ? "User updated" : "No user found");
  } catch (err) {
    console.error("Error updating user:", err);
  }
};

// 사용자 삭제 (예시)
const deleteUser = async (email) => {
  try {
    const deletedRows = await User.destroy({ where: { email } });
    console.log(deletedRows > 0 ? "User deleted" : "No user found");
  } catch (err) {
    console.error("Error deleting user:", err);
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserByID,
  updateRefreshTokenByEmail,
  updateRefreshTokenByID,
};
