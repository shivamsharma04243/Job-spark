// controllers/jobs/index.js
const express = require("express");
const router = express.Router();

// Import job controllers
const getjobs = require("../../api/jobs/get-jobs");
const getjobdetails = require("../../api/jobs/get-jobdetails");
const { postApplication, upload } = require("../../api/jobs/applications");
const getAppliedJobs = require("../../api/jobs/getapplied");
const { requireAuth } = require("../../middlewares/auth");

// Apply auth middleware to protected routes
router.get("/applied-jobs", requireAuth, getAppliedJobs);
router.post("/apply", requireAuth, upload.single("resume"), postApplication);

// Public routes
router.get("/", getjobs);
router.get("/:id", getjobdetails);

module.exports = router;