const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const app = express();
//const PORT = 5000;
const PORT = process.env.PORT || 5000;

// Middleware 설정
app.use(cors()); // React와 통신 허용
app.use(express.json()); // JSON 파싱

// MySQL 연결 설정
const db = mysql.createConnection({
    host: 'hair-manager-db-instance.c5gjudfaqkuu.us-east-1.rds.amazonaws.com', // RDS 엔드포인트
    user: 'admin',
    password: 'admin123',
    database: 'users_db',
});

//db.connect((err) => {
//    if (err) {
//        console.error('MySQL 연결 실패:', err);
//        return;
//    }
//    console.log('MySQL 연결 성공');
//});

// 회원가입 API 엔드포인트
app.post('/signup', async (req, res) => { // async 키워드를 사용하여 await를 사용할 수 있게 함
    const { email, username, password } = req.body;

    // 비밀번호 암호화
    try {
        const salt = await bcrypt.genSalt(10); // 10번의 라운드로 salt 생성
        const hashedPassword = await bcrypt.hash(password, salt); // 비밀번호 암호화

        // 데이터베이스에 저장
        const query = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
        db.query(query, [email, username, hashedPassword], (err, result) => {
            if (err) {
                console.error('데이터 저장 실패:', err);
                return res.status(500).send('데이터베이스 서버 오류');
            }
            res.status(200).send({ message: '회원가입 완료' });
        });
    } catch (err){
        console.error('비밀번호 암호화 실패:', err);
        res.status(500).json({ message: '비밀번호 암호화 실패' });
    }
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
