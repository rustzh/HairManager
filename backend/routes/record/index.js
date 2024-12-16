const express = require('express');
const router = express.Router();

const resultHistoryRoutes = require('./result-history');
const saveResultRoutes = require('./save-result');

router.use('/result-history', resultHistoryRoutes);
router.use('/save-result', saveResultRoutes);

module.exports = router;

