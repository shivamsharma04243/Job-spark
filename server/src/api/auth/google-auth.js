const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

/**
 * signToken(payload)
 * -------------------
 * Helper function to generate a JSON Web Token.
 */
function signToken(payload) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * POST /api/auth/google
 * ---------------------
 * Steps:
 * 1. Verify Google ID token from client.
 * 2. Extract user info (email, name, google_id).
 * 3. Check if user exists by email or google_id.
 * 4. If exists: update last_login and google_id if needed, then login.
 * 5. If not exists: create new user with role from request body.
 * 6. Generate JWT token and set cookie.
 * 7. Return user details.
 */
async function googleAuth(req, res) {
  try {
    const { credential, role } = req.body || {};

    if (!credential) {
      return res.status(400).json({ message: 'Google credential token is required' });
    }

    // Validate role (default to 'user' if not provided or invalid)
    const userRole = (role === 'recruiter' ? 'recruiter' : 'user');

    // Initialize Google OAuth client
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    // Verify the Google ID token
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (err) {
      console.error('Google token verification error:', err);
      return res.status(401).json({ message: 'Invalid Google token' });
    }

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({ message: 'Email not provided by Google' });
    }

    // Get DB connection
    const conn = await pool.getConnection();
    try {
      // Check if user exists by email or google_id
      const [existing] = await conn.execute(
        'SELECT id, email, name, role, google_id, auth_provider FROM users WHERE email = ? OR google_id = ? LIMIT 1',
        [email, googleId]
      );

      let user;

      if (existing.length) {
        // User exists - update last_login and google_id/auth_provider if needed
        const existingUser = existing[0];
        const updates = [];
        const values = [];

        // Update google_id if not set
        if (!existingUser.google_id) {
          updates.push('google_id = ?');
          values.push(googleId);
        }

        // Update auth_provider if not set
        if (!existingUser.auth_provider || existingUser.auth_provider !== 'google') {
          updates.push('auth_provider = ?');
          values.push('google');
        }

        // Update name if changed
        if (name && existingUser.name !== name) {
          updates.push('name = ?');
          values.push(name);
        }

        // Always update last_login
        updates.push('last_login = NOW()');
        values.push(existingUser.id);

        if (updates.length > 1) {
          // More than just last_login
          await conn.execute(
            `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
            values
          );
        } else {
          // Only last_login
          await conn.execute(
            'UPDATE users SET last_login = NOW() WHERE id = ?',
            [existingUser.id]
          );
        }

        // Fetch updated user
        const [updated] = await conn.execute(
          'SELECT id, email, name, role FROM users WHERE id = ?',
          [existingUser.id]
        );
        user = updated[0];
      } else {
        // New user - create account with role from frontend (userRole)
        const randomPassword = require('crypto').randomBytes(32).toString('hex');
        const passwordHash = await require('bcryptjs').hash(randomPassword, 10);

        const [result] = await conn.execute(
          'INSERT INTO users (email, name, password_hash, role, google_id, auth_provider, last_login) VALUES (?, ?, ?, ?, ?, ?, NOW())',
          [email, name || email.split('@')[0], passwordHash, userRole, googleId, 'google']
        );

        user = {
          id: result.insertId,
          email,
          name: name || email.split('@')[0],
          role: userRole,
        };
      }

      // Generate JWT token
      const token = signToken({
        sub: user.id,
        email: user.email,
        role: user.role,
      });

      // Set secure HttpOnly cookie
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
        message: 'Google authentication successful',
      });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Google auth error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = googleAuth;
