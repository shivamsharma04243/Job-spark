const express = require("express");
const router = express.Router();

const createJob = require("../../../../../api/recruiter/hire-jobs/create-job");
// POST /recruiter/hire-jobs - Create a new job posting
router.post("/", createJob);

module.exports = router;
