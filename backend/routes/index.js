const express = require('express');
const router = express.Router();

// 각 모듈의 라우트 가져오기
const loginRoutes = require('./auth/login');
const signUpRoutes = require('./auth/signUp');
const uploadRoutes = require('./user/upload');

// 라우트 등록
router.use('/login', loginRoutes);
router.use('/signup', signUpRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;