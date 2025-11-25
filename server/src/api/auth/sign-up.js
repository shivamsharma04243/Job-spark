const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

/**
 * signToken(payload)
 * -------------------
 * Utility function to generate a signed JSON Web Token.
 *
 * - payload: Data we store in the token (sub, username, role).
 * - secret: Loaded from environment variable JWT_SECRET.
 * - expiresIn: Token expiry (default 7 days).
 */
function signToken(payload) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * POST /api/auth/signup
 * ----------------------
 * Steps:
 * 1. Validate required input fields.
 * 2. Enforce role safety (only "recruiter" or default to "user").
 * 3. Get DB connection from pool.
 * 4. Check if user already exists (email OR username).
 * 5. Hash the password using bcrypt.
 * 6. Insert new user into database.
 * 7. Generate JWT token for authentication.
 * 8. Set HttpOnly cookie containing the token.
 * 9. Return newly created user.
 */
async function signUp(req, res) {
  try {
    // Extract fields from request body
    const { username, email, password, role: inputRole } = req.body || {};

    // Basic input validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email and password are required' });
    }

    // Prevent clients from setting arbitrary roles
    const role = (inputRole === 'recruiter' ? 'recruiter' : 'user');

    // Get a DB connection from the pool
    const conn = await pool.getConnection();
    try {
      /**
       * Step 1: Check if user already exists
       * -------------------------------------
       * Using OR condition so user cannot reuse
       * duplicate email or username.
       */
      const [existing] = await conn.execute(
        'SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1',
        [email, username]
      );

      if (existing.length) {
        return res.status(409).json({ message: 'User already exists' });
      }

      /**
       * Step 2: Hash password
       * ----------------------
       * bcrypt.hash(password, 10)
       *  - 10 rounds of salting (standard strength)
       */
      const passwordHash = await bcrypt.hash(password, 10);

      /**
       * Step 3: Insert new user
       * ------------------------
       * Store hashed password, not plain text.
       */
      const [result] = await conn.execute(
        'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [username, email, passwordHash, role]
      );

      // Build user object for frontend response
      const user = { id: result.insertId, username, email, role };

      /**
       * Step 4: Generate token
       * ------------------------
       * Token contains:
       *  - sub: user ID
       *  - username
       *  - role
       */
      const token = signToken({
        sub: user.id,
        username: user.username,
        role: user.role,
      });

      /**
       * Step 5: Set cookie
       * -------------------
       * Secure cookie settings:
       *  - httpOnly: cannot be accessed via JS (prevents XSS)
       *  - secure: only HTTPS in production
       *  - sameSite:
       *      "none" for cross-site cookies in production
       *      "lax" for local dev
       */
      const isProd = process.env.NODE_ENV === 'production';
      res.cookie('token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Final response
      return res.status(201).json({
        user,
        token,
        message: 'Signup successful',
      });
    } finally {
      // Always release connection back to pool
      conn.release();
    }
  } catch (err) {
    console.error('Signup error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = signUp;
