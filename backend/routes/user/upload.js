const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    res.send('upload api');
});

module.exports = router;