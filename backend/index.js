require('dotenv').config(); // .env 파일 읽어서 process.env로 로드함

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
//const PORT = 5000;
const PORT = process.env.PORT || 5000;

// Middleware 설정
app.use(cors()); // 모든 도메인에서 오는 요청 허용 (React와 통신 허용)
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



app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});