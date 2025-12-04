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
    const { name, email, password, role: inputRole } = req.body || {};

    // Basic input validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }

    // Prevent clients from setting arbitrary roles
    const role = (inputRole === 'recruiter' ? 'recruiter' : 'user');

    // Get a DB connection from the pool
    const conn = await pool.getConnection();
    try {
      /**
       * Step 1: Check if user already exists
       * -------------------------------------
       * Check by email only (username removed from schema)
       */
      const [existing] = await conn.execute(
        'SELECT id FROM users WHERE email = ? LIMIT 1',
        [email]
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
       * Using 'password_hash' column name as per schema.
       */
      const [result] = await conn.execute(
        'INSERT INTO users (name, email, password_hash, role, auth_provider) VALUES (?, ?, ?, ?, ?)',
        [name, email, passwordHash, role, 'local']
      );

      // Build user object for frontend response
      const user = { id: result.insertId, name, email, role };

      /**
       * Step 4: Generate token
       * ------------------------
       * Token contains:
       *  - sub: user ID
       *  - email
       *  - role
       */
      const token = signToken({
        sub: user.id,
        email: user.email,
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
