const { History, FaceType } = require("../models");

// 기록 저장 (Histroy 인스턴스 생성)
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

// 기록 개수 조회
const getHistoryCountById = async (userId) => {
  try {
    const count = await History.count({
      where: {
        userId: userId,
      },
    });
    return count;
  } catch (err) {
    console.error("기록 개수 조회 실패:", err);
  }
};

// 기록 조회 (userID로 기록 찾기)
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

// 가장 오래된 기록 삭제
const deleteOldHistory = async (userId) => {
  try {
    const history = await History.findOne({
      where: {
        userId: userId,
      },
      order: [["createdAt", "ASC"]],
    });
    await history.destroy();
  } catch (err) {
    console.error("가장 오래된 기록 삭제 실패:", err);
  }
};

module.exports = {
  createHistory,
  getHistoryById,
  getHistoryCountById,
  deleteOldHistory,
};
