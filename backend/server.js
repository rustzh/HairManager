require('dotenv').config(); // .env 파일 읽어서 process.env로 로드함

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.PORT;

// Middleware 설정
app.use(cors()); // 모든 도메인에서 오는 요청 허용 (React와 통신 허용)
app.use(express.json()); // JSON 파싱

// MySQL 연결 설정
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
   if (err) {
       console.error('MySQL 연결 실패:', err);
       return;
   }
   console.log('MySQL 연결 성공');
});


// 회원가입 API 엔드포인트
app.post('/signup', async (req, res) => { // async 키워드를 사용하여 await를 사용할 수 있게 함
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


// 로그인 API 엔드포인트
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // 데이터베이스에서 사용자 이메일 조회
    const query = 'SELECT * FROM users WHERE email = ?';
    // 여기에서 result는 쿼리의 결과 -> email이 주어진 값인 객체를 담은 배열
    db.query(query, [email], async (err, result) => {
        if (err) {
            console.error('데이터베이스 오류:', err);
            return res.status(500).send('서버 오류');
        }

        if (result.length === 0) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        // 데이터베이스 오류도 아니고 사용자도 존재한다면 비밀번호 일치 확인
        const user = result[0]; // 이메일로 조회된 사용자의 정보를 담음
        const isMatch = await bcrypt.compare(password, user.password); // bcrypt.compare()가 평문과 암호화 비밀번호를 내부적으로 처리하여 비교함

        if (!isMatch){
            return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.'});
        }

        // 로그인 성공!
        // Access Token 발급
        const accessToken = jwt.sign(
            { userId: user.id },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Refresh Token 발급
        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.SECRET_KEY,
            { expiresIn: '14d' }
        );

        // DB에 Refresh Token 저장
        const queryUpdateRefreshToken = 'INSERT INTO refresh_tokens (refresh_token) VALUES (?)';
        db.query(queryUpdateRefreshToken, [refreshToken], (err, result) => {
            if (err) {
                console.error('Refresh Token 저장 실패:', err);
                return res.status(500).send('서버 오류');
            }
            // 토큰 반환
            res.status(200).json({
                message: '로그인 성공',
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        });
    });
})

// Access Token 갱신 API
app.post('/refresh-token', (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh Token이 필요합니다.'});
    }

    // Refresh Token이 유효한지 확인
    jwt.verify(refreshToken, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Refresh Token이 유효하지 않습니다.'});
        }

        const queryVerifyRefreshToken = 'SELECT * FROM refresh_tokens WHERE refresh_token = ?';
        db.query(queryVerifyRefreshToken, [refreshToken], (err, result) => {
            if (err) {
                console.error('Refresh Token 유효성 확인 실패:', err);
                return res.status(500).send('서버 오류');
            }

            if (result.length === 0) {
                return res.status(404).send('토큰이 유효하지 않습니다.');
            }
            // Refresh Token이 유효하면 새로운 Access Token 발급
            const accessToken = jwt.sign(
                { userId: decoded.userId },
                process.env.SECRET_KEY,
                { expiresIn: '1h' }
            );

            res.status(200).json({
                message: '새로운 Access Token 발급',
                accessToken: accessToken,
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});