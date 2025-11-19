const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Use handlers defined in src/api/auth/users
const signUp = require('../../../api/auth/users/sign-up');
const signIn = require('../../../api/auth/users/sign-in');

// Mounted at /api/auth by routes/router.js, so expose relative paths only
router.post('/signup', signUp);
router.post('/login', signIn);

// GET /api/auth/me - validate cookie and return user info from JWT
router.get('/me', (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
    };
    return res.json({ user });
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

module.exports = router;