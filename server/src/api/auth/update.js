const pool = require('../config/db');

async function updateProfile(req, res) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const allowed = ['username', 'email', 'name'];
    const payload = req.body || {};
    const requested = Object.keys(payload).filter(k => allowed.includes(k));
    if (!requested.length) return res.status(400).json({ message: 'No valid fields to update' });

    const conn = await pool.getConnection();
    try {
      // Get actual columns present in users table
      const [cols] = await conn.query('SHOW COLUMNS FROM users');
      const colNames = cols.map(c => c.Field);

      // Only update fields that actually exist
      const toUpdate = requested.filter(f => colNames.includes(f));
      if (!toUpdate.length) return res.status(400).json({ message: 'No updatable fields available' });

      const setParts = toUpdate.map(f => `${f} = ?`).join(', ');
      const values = toUpdate.map(f => payload[f]);
      values.push(userId);

      const sql = `UPDATE users SET ${setParts} WHERE id = ?`;
      await conn.execute(sql, values);

      // Build select list to return updated user
      const base = ['id','username','email','role'];
      const optional = ['name','created_at','last_login'].filter(c => colNames.includes(c));
      const selectCols = base.concat(optional).join(', ');
      const [rows] = await conn.execute(`SELECT ${selectCols} FROM users WHERE id = ? LIMIT 1`, [userId]);
      if (!rows.length) return res.status(404).json({ message: 'User not found' });

      return res.json({ user: rows[0] });
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error('Update profile error', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = updateProfile;
