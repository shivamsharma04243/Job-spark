const express = require('express');
const router = express.Router();
const adminRegister = require('../../../api/profile/admin/admin-register');
const adminLogin = require('../../../api/profile/admin/admin-login');
const adminLogout = require('../../../api/profile/admin/admin-logout');

// Admin Register
router.post('/register', adminRegister);

// Admin Sign In
router.post('/login', adminLogin);

// Admin Logout
router.post('/logout', adminLogout);

module.exports = router;