const express = require('express');
const router = express.Router();
const { getHistoryById } = require('../../controllers/historyController');
const { auth } = require('../../middleware/authMiddleware');

// 저장된 기록들을 불러옴
router.get('/', auth, async (req, res) => {
    const userId = req.user.id;

    // 해당 유저의 기록들을 DB에서 가져옴
    try {
        const histories = await getHistoryById(userId);
        console.log('기록 불러오기 성공');
        return res.status(200).json(histories);
    } catch (err) {
        console.log('기록 불러오기 실패', err);
    }
});

module.exports = router;