const { FaceType } = require("../models");

const getFaceTypeByCode = async (typeCode) => {
  try {
    const faceTypes = await FaceType.findAll({
      where: {
        typeCode: typeCode,
      },
    });
    return faceTypes;
  } catch (err) {
    console.error("결과 조회 실패: ", err);
    throw err;
  }
};

module.exports = { getFaceTypeByCode };
