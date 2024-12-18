require('dotenv').config();
const express = require('express');
const router = express.Router();
const fs = require('fs');
const User = require('../../models/User');
const History = require('../../models/History');
const { auth } = require('../../middleware/authMiddleware');
const { s3 } = require('../../config/aws');

const imageCache = new Map();

// 결과를 저장함 (userId, 검색날짜, 결과얼굴형)
router.post('/', auth, (req, res) => {
    const { fileName, faceShape } = req.body;
    const userID = req.user.id;
    const cacheData = imageCache.get(fileName);

    if (!cacheData) {
        return res.status(404).json({
            message: "이미지 세션이 만료되었습니다."
        });
    }

    const { filePath, timer } = cacheData;

    // 결과값 저장 
    // 이미지 - S3 저장
    // try {
    //     const fileContent = fs.readFileSync(filePath);
    //     const params = {
    //         Bucket: process.env.AWS_BUCKET_NAME,
    //         Key: fileName,
    //         Body: fileContent,
    //         ContentType: 'image/jpeg'
    //     };
        
    //     const uploadResult = await s3.upload(params).promise();
    //     const imageUrl = uploadResult.Location;

    //     // s3에 저장 후 로컬 이미지는 삭제
    //     clearTimeout(timer);
    //     fs.unlinkSync(filePath);
    //     imageCache.delete(fileName);

    //     console.log('이미지 s3 저장 성공');
    // }

    // 결과값 - DB (faceShape, imageUrl, userID)

    // 성공
});

module.exports = router;