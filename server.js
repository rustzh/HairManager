// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // MongoDB 사용 시
const cors = require('cors'); // CORS 패키지 임포트

const app = express();

// CORS 설정 추가
app.use(cors());

app.use(bodyParser.json());

// 데이터베이스 연결 설정 (MongoDB 예시)
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 사용자 스키마 생성
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', UserSchema);

// 회원가입 엔드포인트
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  
  // 새 사용자 생성 및 저장
  const newUser = new User({ username, password });
  await newUser.save();
  
  res.status(201).json({ message: '회원가입 성공' });
});

app.listen(5000, () => {
  console.log('서버가 http://localhost:5000에서 실행 중');
});