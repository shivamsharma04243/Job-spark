const express = require("express");
const router = express.Router();

//  here are Import job controllers
const getjobs = require("../../api/jobs/get-jobs");
const getjobdetails = require("../../api/jobs/get-jobdetails");
const { postApplication, upload } = require("../../api/jobs/applications");
const getAppliedJobs = require("../../api/jobs/getapplied");
const removeSavedJob = require("../../api/jobs/savejobs/removeSavedJob");
const checkSavedJob = require("../../api/jobs/savejobs/checkSavedJob");
const saveJob = require("../../api/jobs/savejobs/savedJobs");
const getSavedJobs = require("../../api/jobs/savejobs/getSavedJobs");
const { requireAuth } = require("../../middlewares/auth");

// Apply auth middleware to protected routes
router.get("/applied-jobs", requireAuth, getAppliedJobs);
router.post("/apply", requireAuth, upload.single("resume"), postApplication);

// Saved jobs routes
router.post("/save/:job_id", requireAuth, saveJob);
router.delete("/save/:job_id", requireAuth, removeSavedJob);
router.get("/save/:job_id", requireAuth, checkSavedJob);
router.get("/saved-jobs", requireAuth, getSavedJobs);

// Public routes
router.get("/", getjobs);
router.get("/:id", getjobdetails);

module.exports = router;