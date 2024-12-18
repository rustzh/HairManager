const { History, FaceType } = require("../models");

// 결과 저장 (Histroy 인스턴스 생성)
const createHistory = async (userId, typeCode, imageUrl) => {
  try {
    const history = await History.create({
      userId: userId,
      typeCode: typeCode,
      imageUrl: imageUrl,
    });
    console.log("결과가 저장되었습니다. ", history);
    return history;
  } catch (err) {
    console.error("결과 저장 실패: ", err);
    throw err;
  }
};

// 결과 조회 (userID로 결과 찾기)
const getHistoryById = async (userId) => {
  try {
    const histories = await History.findAll({
      include: {
        model: FaceType,
        required: true,
      },
      where: {
        userId: userId,
      },
      order: [["createdAt", "DESC"]],
    });
    return histories;
  } catch (err) {
    console.error("결과 조회 실패: ", err);
    throw err;
  }
};

module.exports = { createHistory, getHistoryById };
