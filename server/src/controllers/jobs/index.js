// routes/jobs.js - expose job APIs at the router root
const express = require("express");
const getjobs = require("../../api/jobs/get-jobs");
const getjobdetails = require("../../api/jobs/get-jobdetails");
const postapplications = require("../../api/jobs/apply/applications");
const router = express.Router();


// Mount at root so when main router uses router.use('/jobs', thisRouter):
//   GET / maps to /api/jobs (list jobs)
//   GET /:id maps to /api/jobs/:id (single job)
router.get("/", getjobs);
router.get("/:id", getjobdetails);
router.use("/apply", postapplications);

module.exports = router;
