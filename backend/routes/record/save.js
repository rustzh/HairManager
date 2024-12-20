const express = require("express");
const router = express.Router();
const imageCache = require("../../utils/imageCache");
const { auth } = require("../../middleware/authMiddleware");
const { imageUploadToS3 } = require("../../services/s3Service");
const {
  createHistory,
  deleteOldHistory,
  getHistoryCountById,
} = require("../../controllers/historyController");

// 결과를 저장함 (userId, 검색날짜, 결과얼굴형)
router.post("/", auth, async (req, res) => {
  const { fileName, typeCode } = req.body;
  const userId = req.user.id;
  const cacheData = imageCache.get(fileName);

  if (!cacheData) {
    return res.status(404).json({
      message: "이미지 세션이 만료되었습니다.",
    });
  }

  const { filePath, timer } = cacheData;

  // 결과값 저장
  try {
    // 이미지 - S3 저장
    const imageUrl = await imageUploadToS3(userId, filePath, fileName, timer);

    // 결과값 - DB (userId, typeCode, imageUrl)
    const historyCount = await getHistoryCountById(userId);
    // 기록이 이미 5개 이상이라면 가장 오래된 기록 삭제
    if (historyCount >= 5) {
      await deleteOldHistory(userId);
    }
    await createHistory(userId, typeCode, imageUrl);
    console.log("DB 저장 완료");
    res.status(200).json({
      message: "저장 완료",
    });
  } catch (err) {
    console.log("저장 실패", err);
    return res.status(500).json({
      message: "저장 실패",
    });
  }
});

module.exports = router;
