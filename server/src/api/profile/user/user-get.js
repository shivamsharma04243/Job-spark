const express = require('express');
const router = express.Router();
const pool = require('../../config/db');
const { requireAuth } = require('../../../middlewares/auth');

const getuser = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const [rows] = await connection.execute('SELECT * FROM user_profiles WHERE user_id = ?', [userId]);
    if (!rows || rows.length === 0) return res.status(404).json({ success: false, message: 'Profile not found' });

    res.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error('GET profile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    connection.release();
  }
};

module.exports = getuser;