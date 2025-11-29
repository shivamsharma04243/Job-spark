const jwt = require('jsonwebtoken');

function requireAdminAuth(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user is admin
    if (payload.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      full_name: payload.full_name,
      loginAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : undefined,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
}

module.exports = { requireAdminAuth };