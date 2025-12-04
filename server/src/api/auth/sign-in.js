const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

/**
 * signToken(payload)
 * -------------------
 * Helper function to generate a JSON Web Token.
 * - payload: data stored inside the token (user ID, username, role).
 * - expiresIn: defaults to 7 days if not provided.
 */
function signToken(payload) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * POST /api/auth/login
 * ---------------------
 * Steps:
 * 1. Validate body input.
 * 2. Fetch user by email.
 * 3. Compare input password with stored password hash.
 * 4. Update last_login timestamp.
 * 5. Generate JWT token.
 * 6. Set authentication cookie.
 * 7. Return logged-in user details.
 */
async function signIn(req, res) {
  try {
    const { identifier, password } = req.body || {};

    // identifier is email (username removed from schema)
    if (!identifier || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    // Get DB connection from pool
    const conn = await pool.getConnection();
    try {
      /**
       * Step 1: Look up user by email
       * ------------------------------
       * Email is the identifier now (username removed).
       */
      const [rows] = await conn.execute(
        'SELECT id, name, email, role, password_hash FROM users WHERE email = ? LIMIT 1',
        [identifier]
      );

      // User not found
      if (!rows.length) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const userRow = rows[0];

      /**
       * Step 2: Compare input password with stored hash
       * ------------------------------------------------
       * bcrypt.compare() returns true if passwords match.
       */
      const valid = await bcrypt.compare(password, userRow.password_hash);
      if (!valid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      /**
       * Step 3: Update last_login timestamp
       */
      await conn.execute(
        'UPDATE users SET last_login = NOW() WHERE id = ?',
        [userRow.id]
      );

      /**
       * Step 4: Prepare safe user object (never send password_hash)
       */
      const user = {
        id: userRow.id,
        name: userRow.name,
        email: userRow.email,
        role: userRow.role,
      };

      /**
       * Step 5: Generate JWT token
       * ---------------------------
       * Payload includes:
       *  - sub (ID)
       *  - email
       *  - role
       */
      const token = signToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      /**
       * Step 5: Set secure HttpOnly cookie
       * ----------------------------------
       * - httpOnly: JS cannot read it (protects against XSS)
       * - secure: only works over HTTPS in production
       * - sameSite:
       *     - "none" for cross-site cookies in production
       *     - "lax" for local development
       */
      const isProd = process.env.NODE_ENV === 'production';
      res.cookie('token', token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.json({
        user,
        token,
        message: 'Login successful',
      });

    } finally {
      // Always release DB connection
      conn.release();
    }

  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = signIn;
