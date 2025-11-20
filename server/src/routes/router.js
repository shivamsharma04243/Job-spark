const express = require('express');
const router = express.Router();
const recruiterJobRoutes = require('../controllers/recruiter/hire-jobs/index');
// AUTH
const authRoutes = require('../controllers/auth/users/index');
router.use('/auth', authRoutes);
// Recruiter jobs
router.use('/recruiter/jobs', recruiterJobRoutes);


module.exports = router;
