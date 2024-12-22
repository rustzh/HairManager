const multer = require('multer');
const path = require('path');

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, '../uploads/temp'));
        },
        filename: function (req, file, cb) {
            const newFileName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
            cb(null, newFileName);
        }
    })
});

module.exports = { upload };