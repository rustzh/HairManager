const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 사용자 확인
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 비밀번호 확인
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '비밀번호가 틀렸습니다.' });
    }

    // Access Token 발급
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_SECRET_KEY,
      { expiresIn: '15m' }
    );

    // Refresh Token 발급
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: '14d' } // 만료시간 14일
    );

    // Refresh Token을 HttpOnly 쿠키에 저장
    res.cookie('user_refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // https에서만 동작
      sameSite: 'strict', // CSRF 방지
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14일
    });

    // Refresh Token을 DB에 저장
    await User.updateRefreshTokenByEmail(email, refreshToken);

    // Access Token을 클라이언트에 전달
    res.status(200).json({
      message: '로그인 성공',
      accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 에러가 발생했습니다.' });
  }
});

module.exports = router;