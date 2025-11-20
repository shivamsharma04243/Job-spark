const express = require("express");
const router = express.Router();

const createJob = require("../../../../../api/recruiter/hire-jobs/create-job");
// POST /api/admin/jobs
router.post("/", createJob);

module.exports = router;
