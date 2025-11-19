const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Use handlers defined in src/api/auth/users
const signUp = require('../../../api/auth/users/sign-up');
const signIn = require('../../../api/auth/users/sign-in');
const { requireAuth, authCheck } = require('../../../middlewares/auth');
// Mounted at /api/auth by routes/router.js, so expose relative paths only
router.post('/signup', signUp);
router.post('/login', signIn);
router.get('/authcheck', requireAuth, authCheck);
// alias: GET /api/auth/me
// router.get('/me', requireAuth, authCheck);





module.exports = router;