const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../../middlewares/auth');
const getRecruiterJobs = require('../../../api/recruiter/hire-jobs/getRecruiterJobs');
const getRecruiterJobStats = require("../../../api/recruiter/hire-jobs/getRecruiterJobStats");
const getJobApplicants = require("../../../api/recruiter/hire-jobs/getJobApplicants");
const updateApplicationStatus = require("../../../api/recruiter/hire-jobs/updateApplicationStatus");
const createJob = require('../../../api/recruiter/hire-jobs/create-job');
// Apply authentication middleware
router.use(requireAuth);
// POST /api/recruiter/jobs/create
router.post('/create', createJob);
// GET /api/recruiter/jobs
router.get('/', getRecruiterJobs);
// GET /api/recruiter/jobs/stats
router.get('/stats', getRecruiterJobStats);
// PUT /api/recruiter/jobs/applications/:applicationId/status (must be before /:jobId route)
router.put('/applications/:applicationId/status', updateApplicationStatus);
// GET /api/recruiter/jobs/:jobId/applicants
router.get('/:jobId/applicants', getJobApplicants);
// GET /api/recruiter/jobs/stats/overview


module.exports = router;
