const pool = require('../config/db');

/**
 * GET /api/jobs/roles
 * Returns all available job roles from job_roles table.
 */
async function getRoles(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, name FROM job_roles ORDER BY name ASC'
    );

    const roles = rows.map((r) => ({
      id: r.id,
      name: r.name,
    }));

    res.json({ ok: true, roles });
  } catch (err) {
    console.error('GET /api/jobs/roles error:', err);
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  }
}

module.exports = getRoles;


