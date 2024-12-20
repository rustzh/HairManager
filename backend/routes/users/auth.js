const express = require("express");
const router = express.Router();
const { auth } = require('../../middleware/authMiddleware');  // 인증 미들웨어

// 인증된 사용자 정보를 반환하는 GET 요청
router.get('/', auth, (req, res) => {
  res.status(200).json({
    id: req.user.id,
    email: req.user.email,
    username: req.user.username,  // 인증된 사용자 정보 반환
  });
});

module.exports = router;
