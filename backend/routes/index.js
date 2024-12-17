const express = require('express');
const router = express.Router();

const usersRoutes = require('./users');
const recordRoutes = require('./record');

router.use('/users', usersRoutes);
router.use('/record', recordRoutes);

module.exports = router;

