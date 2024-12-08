const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../../config/db')

// 회원가입 API 엔드포인트
router.post('/', async (req, res) => { // async 키워드를 사용하여 await를 사용할 수 있게 함
    const { email, name, password } = req.body;

    // 비밀번호 암호화
    try {
        const salt = await bcrypt.genSalt(10); // 10번의 라운드로 salt 생성
        const hashedPassword = await bcrypt.hash(password, salt); // 비밀번호 암호화

        // 데이터베이스에 저장
        const query = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
        db.query(query, [email, name, hashedPassword], (err, result) => {
            if (err) {
                console.error('데이터 저장 실패:', err);
                return res.status(500).send('데이터베이스 오류');
            }
            res.status(200).send({ message: '회원가입 완료' });
        });
    } catch (err){
        console.error('비밀번호 암호화 실패:', err);
        res.status(500).json({ message: '비밀번호 암호화 실패' });
    }
});

module.exports = router;