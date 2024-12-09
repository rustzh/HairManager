const express = require('express');
const router = express.Router();

const registerRoutes = require('./users/register');
const loginRoutes = require('./users/login');
const authRoutes = require('./users/auth');
const logoutRoutes = require('./users/logout');

router.use('/users/register', registerRoutes);
router.use('/users/login', loginRoutes);
router.use('/users/auth', authRoutes);
router.use('/users/logout', logoutRoutes);

module.exports = router;