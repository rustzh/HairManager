require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    // Authorization 헤더에서 access token을 가져옴
    const accessToken = req.header('Authorization')?.replace('Bearer ', ''); 
    const refreshToken = req.cookies.user_refreshToken;

    if (!accessToken) {
        return res.status(401).json({ message: "access token이 없습니다." });
    }

    if (!refreshToken) {
        return res.status(401).json({ message: 'refresh token이 없습니다.' });          
    }

    // refreshToken이 있으면 유효성 검증
    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, async (refreshErr, refreshDecoded) => {
        if (refreshErr) {
            return res.status(403).json({ message: 'refresh token이 유효하지 않습니다.' });
        }

        // refreshToken이 유효하면 DB 확인
        const user = await User.getUserByID(refreshDecoded.userId);
        console.log('refreshtoken: ', user.refreshtoken);
        
        // refreshToken이 DB에 저장된 값과 일치하지 않으면
        if (!user.refreshtoken || user.refreshtoken !== refreshToken) {
            return res.status(403).json({ message: '재로그인이 필요합니다.' });
        }

        // accessToken 유효성 검증
        jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY, async (err, decoded) => {
            // accessToken이 만료된 경우
            if (err && err.name === 'TokenExpiredError') {
                // accessToken 재발급
                const newAccessToken = jwt.sign(
                    { userId: refreshDecoded.userId },
                    process.env.ACCESS_SECRET_KEY, // 수정된 키 이름
                    { expiresIn: '15m' } // 유효기간 15분 설정
                );

                // 클라이언트로 새로운 Access Token 응답
                res.setHeader('Authorization', `Bearer ${newAccessToken}`);
                req.user = await User.getUserByID(refreshDecoded.userId);
                console.log('access token 재발급 - 인증 성공');
                next();
            } else if (err) {
                return res.status(403).json({ message: 'access token이 유효하지 않습니다.' });
            } else {
                // access token이 유효하면 유저 정보 그대로 내보냄
                req.user = await User.getUserByID(decoded.userId);
                console.log('인증 성공');
                next();
            }
        });
    });
};

module.exports = { auth };