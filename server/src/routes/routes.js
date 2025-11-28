const express = require('express');
const router = express.Router();
const recruiterJobRoutes = require('../controllers/recruiter/hire-jobs/index');
const jobsRouter = require('../controllers/jobs/index');
const profileRoutes = require("../controllers/profile/user/index");
const authRoutes = require('../controllers/auth/users/index');
const recruiter_profiles = require("../controllers/profile/recruiter/index");



// Auth routes
router.use('/auth', authRoutes);
// Recruiter jobs
router.use('/recruiter/jobs', recruiterJobRoutes);
// Jobs
router.use('/jobs', jobsRouter);
// (No dedicated /applications controller - applications are mounted under /jobs/apply)
// Profile
router.use('/profile', profileRoutes);
// Recruiter Profiles
router.use('/profile', recruiter_profiles);

module.exports = router;
