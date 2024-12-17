require('dotenv').config();
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const runPython = require('../../keras_model/pythonRunner');

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '../../src/uploads'));
        },
        filename: function (req, file, cb) {
            const newFileName = Date.now() + path.extname(file.originalname);
            cb(null, newFileName);
        }
    })
});  

router.post('/', upload.single('file'), async (req, res) => {
    try {
        // 모델 파일에서 얼굴형 코드 받아옴
        const faceShapeCode = await runPython([req.file.path]);
        // 얼굴형 코드 + 성별 코드 조합으로 csv 파일에서 결과값 가져옴

        fs.unlinkSync(req.file.path);
        res.json({
            faceShape: faceShapeCode.trim()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error
        });
    }
});

module.exports = router;