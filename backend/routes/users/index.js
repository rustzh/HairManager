const express = require('express');
const router = express.Router();

const registerRoutes = require('./register');
const loginRoutes = require('./login');
const authRoutes = require('./auth');
const logoutRoutes = require('./logout');

router.use('/register', registerRoutes);
router.use('/login', loginRoutes);
router.use('/auth', authRoutes);
router.use('/logout', logoutRoutes);

module.exports = router;

