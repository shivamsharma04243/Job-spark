const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../../middlewares/auth');
const getRecruiterJobs = require('../../../api/recruiter/hire-jobs/getRecruiterJobs');
// Import job creation handler
const createJob = require('../../../api/recruiter/hire-jobs/create-job');
// Apply authentication middleware
router.use(requireAuth);
// POST /api/recruiter/jobs/create
router.post('/create', createJob);
// GET /api/recruiter/jobs
router.get('/', getRecruiterJobs);

module.exports = router;
