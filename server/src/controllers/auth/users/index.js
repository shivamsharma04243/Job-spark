const express = require('express');
const router = express.Router();
const logout = require('../../../api/auth/logout');
const updateProfile = require('../../../api/auth/update');
/**
 * Import Auth Handlers
 * ---------------------
 * These handlers contain the actual logic for signup and login.
 * They live in: src/api/auth/users/
 *
 * signUp  → Creates new user, hashes password, saves to DB, sets cookie.
 * signIn  → Validates credentials, checks DB, issues JWT cookie.
 */
const signUp = require('../../../api/auth/sign-up');
const signIn = require('../../../api/auth/sign-in');

/**
 * Auth Middleware
 * ----------------
 * requireAuth  → Ensures that the incoming request has a valid JWT cookie.
 * authCheck    → Returns the decoded user data stored in req.user.
 */
const { requireAuth, authCheck } = require('../../../middlewares/auth');

/**
 * Route Mount Point
 * ------------------
 * This file is mounted at /api/auth in routes/router.js:
 * 
 *     app.use('/api/auth', index)
 *
 * So the final endpoints become:
 *   POST   /api/auth/signup
 *   POST   /api/auth/login
 *   GET    /api/auth/authcheck
 *   ( optional alias ) /api/auth/me
 */

// Create new user
router.post('/signup', signUp);

// Login user and issue JWT cookie
router.post('/login', signIn);

// Validate token + return currently authenticated user
router.get('/authcheck', requireAuth, authCheck);

// Alias if you want cleaner endpoint:
router.get('/me', requireAuth, authCheck);
// Update profile (authenticated)
router.put('/me', requireAuth, updateProfile);
// Logout user by clearing the cookie
router.post('/logout', logout);

module.exports = router;
