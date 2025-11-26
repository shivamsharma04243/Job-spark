const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../../middlewares/auth');
const recruiterProfile = require("../../../api/profile/recruiter/recruiter-put");

router.use(express.json());
router.put('/recruiter', requireAuth, recruiterProfile);