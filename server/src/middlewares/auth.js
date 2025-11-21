// GET /api/auth/me - Validate cookie and return user info from JWT
const jwt = require('jsonwebtoken');

/**
 * Middleware: requireAuth
 * -----------------------
 * Purpose:
 *   - Check if a JWT token exists in cookies.
 *   - Verify the token using JWT_SECRET.
 *   - Attach decoded user information to req.user.
 *   - If token is missing or invalid → block request with 401 Unauthorized.
 *
 * Flow:
 *   1. Read token from req.cookies.token.
 *   2. If token not found → return 401.
 *   3. Verify token → decode payload.
 *   4. Store user information in req.user.
 *   5. Call next() to continue to protected route.
 */
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
