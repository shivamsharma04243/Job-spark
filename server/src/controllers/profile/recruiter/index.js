const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../../middlewares/auth');
const recruiterProfile = require("../../../api/profile/recruiter/recruiter-put");
const getRecruiterProfile = require("../../../api/profile/recruiter/get-recruiter");

router.use(express.json());
router.get('/recruiter', requireAuth, getRecruiterProfile);

router.use(express.json());
router.put('/recruiter', requireAuth, recruiterProfile);
module.exports = router;