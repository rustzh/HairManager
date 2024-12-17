require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const History = require('../../models/History');
const { auth } = require('../../middleware/authMiddleware');

// 결과를 저장함 (userId, 검색날짜, 결과얼굴형)
router.post('/', auth, (req, res) => {
    req.user.id
});

module.exports = router;