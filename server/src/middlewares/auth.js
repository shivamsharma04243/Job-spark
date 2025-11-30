
const jwt = require('jsonwebtoken');


function requireAuth(req, res, next) {
  try {
    // Extract token from cookies
    const token = req.cookies?.token;

    // If no token found, block access
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    // Verify token and extract payload
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Attach essential user details to req.user for use in next handlers
    // Include token issuance time (iat) as loginAt so frontend can show login time
    req.user = {
      id: payload.sub,
      username: payload.username,
      role: payload.role,
      loginAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : undefined,
    };

    return next(); // Move to the next middleware/controller
  } catch (err) {
    // Token expired or invalid
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

/**
 * Handler: authCheck
 * -------------------
 * Purpose:
 *   - Return the currently authenticated user's data.
 *   - This handler must run after requireAuth middleware.
 *
 * Flow:
 *   1. Check if req.user exists.
 *   2. If not → return 401.
 *   3. Send user object in response.
 */
function authCheck(req, res) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  // Send user info to frontend
  return res.json({ user: req.user });
}

module.exports = { requireAuth, authCheck };
