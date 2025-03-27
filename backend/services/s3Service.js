const axios = require("axios");
const fs = require("fs");
const imageCache = require("../utils/imageCache");

const imageUploadToS3 = async (userId, filePath, fileName, timer, imageUrl) => {
  try {
    // s3 파일 업로드
    const fileContent = fs.readFileSync(filePath);
    await axios.put(imageUrl, fileContent, {
      headers: {
        "Content-Type": "image/jpeg",
      },
    });

    // s3에 저장 후 로컬 이미지는 삭제
    clearTimeout(timer);
    fs.unlinkSync(filePath);
    imageCache.delete(fileName);

    console.log("이미지 s3 저장 성공");
  } catch (err) {
    console.log("이미지 저장 실패", err);
    throw err;
  }
};

// s3 파일 삭제

module.exports = { imageUploadToS3 };
