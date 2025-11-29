const express = require('express');
const router = express.Router();
const adminRegister = require('../../../api/profile/admin/admin-register');
const adminLogin = require('../../../api/profile/admin/admin-login');
const adminLogout = require('../../../api/profile/admin/admin-logout');
const { requireAdminAuth } = require('../../../middlewares/adminAuth');
const getAdminUsers = require('../../../api/profile/admin/admin-users');
const getAdminRecruiters = require('../../../api/profile/admin/admin-recruiters');
const getAdminJobs = require('../../../api/profile/admin/admin-jobs');

// Admin Register
router.post('/register', adminRegister);

// Admin Sign In
router.post('/login', adminLogin);

// Admin Logout
router.post('/logout', adminLogout);
router.get('/users', requireAdminAuth, getAdminUsers);
router.get('/recruiters', requireAdminAuth, getAdminRecruiters);
router.get('/jobs', requireAdminAuth, getAdminJobs);


module.exports = router;