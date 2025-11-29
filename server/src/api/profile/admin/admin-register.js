const pool = require('../../../api/config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminRegister = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { full_name, email, phone, password } = req.body;

    // Validation
    if (!full_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and password are required'
      });
    }

    // Check if admin already exists
    const [existingAdmins] = await connection.execute(
      'SELECT admin_id FROM admins WHERE email = ?',
      [email]
    );

    if (existingAdmins.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert admin
    const [result] = await connection.execute(
      'INSERT INTO admins (full_name, email, phone, password_hash) VALUES (?, ?, ?, ?)',
      [full_name, email, phone || null, password_hash]
    );

    // Generate JWT token
    const token = jwt.sign(
      {
        sub: result.insertId,
        email: email,
        role: 'admin',
        full_name: full_name
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      admin: {
        admin_id: result.insertId,
        full_name,
        email,
        phone
      }
    });

  } catch (error) {
    console.error('Admin register error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = adminRegister;