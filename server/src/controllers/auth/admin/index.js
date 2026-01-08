const express = require('express');
const router = express.Router();
const { validateInput } = require('../../../middlewares/inputValidation');
const adminRegister = require('../../../api/profile/admin/admin-register');
const adminLogin = require('../../../api/profile/admin/admin-login');
const adminLogout = require('../../../api/profile/admin/admin-logout');
const { requireAdminAuth } = require('../../../middlewares/adminAuth');
const getAdminUsers = require('../../../api/profile/admin/admin-users');
const getAdminRecruiters = require('../../../api/profile/admin/admin-recruiters');
const getAdminJobs = require('../../../api/profile/admin/admin-jobs');
const verifyRecruiter = require('../../../api/profile/admin/admin-verify-recruiter');
const updateJobStatus = require('../../../api/profile/admin/admin-update-job-status');
const {
    getJobRoles,
    createJobRole,
    updateJobRole,
    deleteJobRole
} = require('../../../api/profile/admin/admin-job-roles');

// Admin Register
router.post('/register', validateInput, adminRegister);

// Admin Sign In
router.post('/login', validateInput, adminLogin);

// Admin Logout
router.post('/logout', adminLogout);
router.get('/users', requireAdminAuth, getAdminUsers);
router.get('/recruiters', requireAdminAuth, getAdminRecruiters);
router.get('/jobs', requireAdminAuth, getAdminJobs);
router.put('/recruiters/:recruiterId/verify', requireAdminAuth, verifyRecruiter);
router.put('/jobs/:jobId/status', requireAdminAuth, updateJobStatus);

// Job Roles routes
router.get('/job-roles', requireAdminAuth, getJobRoles);
router.post('/job-roles', requireAdminAuth, validateInput, createJobRole);
router.put('/job-roles/:id', requireAdminAuth, validateInput, updateJobRole);
router.delete('/job-roles/:id', requireAdminAuth, deleteJobRole);



module.exports = router;