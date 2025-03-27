const express = require('express');
const router = express.Router();

const historyRoutes = require('./history');
const saveRoutes = require('./save');
const runRoutes = require('./run');

router.use('/history', historyRoutes);
router.use('/save', saveRoutes);
router.use('/run', runRoutes);

module.exports = router;

