require('dotenv').config();
const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');

// 입력으로 들어온 결과를 저장함
// 우선은 이미지 + 결과 얼굴형 저장
router.get('/', (req, res) => {
    
});

module.exports = router;