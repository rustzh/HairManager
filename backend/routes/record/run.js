const express = require("express");
const router = express.Router();
const fs = require("fs");
const imageCache = require("../../utils/imageCache");
const runPython = require("../../controllers/pythonRunner");
const { getFaceTypeByCode } = require("../../controllers/faceTypeController");
const { upload } = require("../../middleware/multerMiddleware");

router.post("/", upload.single("file"), async (req, res) => {
  try {
    // 모델 파일에서 얼굴형 코드 받아오기
    const gender = req.body.gender;
    const genderCode = gender === "male" ? "1" : "2"; // 남자 = "1", 여자 = "2"
    const fileName = req.file.filename;
    const filePath = req.file.path;
    const faceShapeCode = await runPython([filePath]);

    // 로컬 이미지 삭제 타이머 설정 - 10분 후
    const timer = setTimeout(() => {
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) console.error("이미지 삭제 실패");
          else console.log("이미지 삭제 성공");
        });
      }
      imageCache.delete(fileName);
    }, 10 * 60 * 1000);

    // 파일 이름 + 타이머 저장
    imageCache.set(fileName, { filePath, timer });

    // 성별 코드 + 얼굴형 코드 조합으로 csv 파일에서 결과값 가져오기
    const typeCode = (genderCode + faceShapeCode).trimEnd(); // faceShapeCode에 개행문자가 있어서 trim()

    try {
      const queryResult = await getFaceTypeByCode(typeCode);
      res.status(200).json({
        fileName: fileName,
        typeCode: queryResult[0].dataValues.typeCode,
        typeName: queryResult[0].dataValues.typeName,
        typeDesc: queryResult[0].dataValues.typeDesc,
        hairName: queryResult[0].dataValues.hairName,
        hairDesc: queryResult[0].dataValues.hairDesc,
      });
    } catch (err) {
      return res.json({
        message: "코드 조회 실패",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
});

module.exports = router;
