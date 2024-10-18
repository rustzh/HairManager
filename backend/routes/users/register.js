const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../../models/User');

// 회원가입 API 엔드포인트
router.post('/', async (req, res) => { // async 키워드를 사용하여 await를 사용할 수 있게 함
    const { email, username, password } = req.body;

    // 비밀번호 암호화
    try {
        const salt = await bcrypt.genSalt(10); // 10번의 라운드로 salt 생성
        const hashedPassword = await bcrypt.hash(password, salt); // 비밀번호 암호화

        // 데이터베이스에 저장
        await User.createUser(email, username, hashedPassword, '');
        
        console.log('회원가입 성공!')
        return res.status(200).json({ message: '회원가입 성공!' });
    } catch (err){
        console.error('회원가입 실패:', err);
        res.status(500).json({ message: '회원가입 실패' });
    }
});

module.exports = router;