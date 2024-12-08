require('dotenv').config(); // 환경변수 로드
const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes');

// 미들웨어 설정
app.use(express.json()); // JSON 요청 파싱
app.use(express.urlencoded({ extended: true })); // URL-encoded 요청 파싱

app.use(cors());

// 라우트 연결
app.use('/', routes);

// 서버 실행
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});