const express = require('express');
const router = express.Router();

// Import all route modules
const recruiterJobRoutes = require('../controllers/recruiter/hire-jobs/index');
const jobsRouter = require('../controllers/jobs/index'); // This should point to jobs.js router
const profileRoutes = require("../controllers/profile/user/index");
const authRoutes = require('../controllers/auth/users/index');
const recruiter_profiles = require("../controllers/profile/recruiter/index");
const  requireAdminAuth  = require('../controllers/auth/admire/index');

// Auth routes
router.use('/auth', authRoutes);
// Admin Auth routes
router.use('/admin/auth', requireAdminAuth);

// Recruiter jobs
router.use('/recruiter/jobs', recruiterJobRoutes);

// Jobs routes - FIXED: This mounts at /api/jobs
router.use('/jobs', jobsRouter);

// Profile routes
router.use('/profile', profileRoutes);

// Recruiter Profiles - FIXED: Changed to avoid conflict
router.use('/recruiter-profile', recruiter_profiles);

module.exports = router;