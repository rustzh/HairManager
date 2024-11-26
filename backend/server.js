const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware 설정
app.use(cors()); // React와 통신 허용
app.use(bodyParser.json()); // JSON 파싱

// MySQL 연결 설정
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test_db',
});

db.connect((err) => {
    if (err) {
        console.error('MySQL 연결 실패:', err);
        return;
    }
    console.log('MySQL 연결 성공');
});

// 회원가입 API 엔드포인트
app.post('/signup', (req, res) => {
    const { email, username, password } = req.body;

    // 데이터베이스에 저장
    const query = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
    db.query(query, [email, username, password], (err, result) => {
        if (err) {
            console.error('데이터 저장 실패:', err);
            res.status(500).send('서버 오류');
            return;
        }
        res.status(200).send({ message: '회원가입 성공' });
    });
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
