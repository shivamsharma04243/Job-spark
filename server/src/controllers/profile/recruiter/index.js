const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../../middlewares/auth');
const recruiterProfile = require("../../../api/profile/recruiter/recruiter-put");
const getRecruiterProfile = require("../../../api/profile/recruiter/get-recruiter");
// GET /recruiter - Get recruiter profile
router.use(express.json());
router.get('/recruiter', requireAuth, getRecruiterProfile);
// PUT /recruiter - Update recruiter profile
router.use(express.json());
router.put('/recruiter', requireAuth, recruiterProfile);
module.exports = router;