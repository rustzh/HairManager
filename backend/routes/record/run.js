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
        const result = await runPython([req.file.path]);

        fs.unlinkSync(req.file.path);
        res.json({
            success: true,
            result: result.trim()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error
        });
    }
});

module.exports = router;