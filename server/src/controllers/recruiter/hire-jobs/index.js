const express = require('express');
const router = express.Router();

// Import job creation handler
const createJob = require('../../../api/recruiter/hire-jobs/create-job');

// POST /api/recruiter/jobs/create
router.post('/create', createJob);

module.exports = router;
