

// GET /api/auth/me - validate cookie and return user info from JWT
const jwt = require('jsonwebtoken');

// Middleware to require a valid JWT cookie and attach `req.user`
function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, username: payload.username, role: payload.role };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

// Handler to return current authenticated user (for a route like GET /api/auth/authcheck)
function authCheck(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  return res.json({ user: req.user });
}

module.exports = { requireAuth, authCheck };