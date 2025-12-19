const pool = require('../config/db');

/**
 * GET /api/jobs/filters
 * Returns dynamic filter options based on approved jobs only:
 * - cities: distinct cities from jobs.city where status='approved'
 * - roles: distinct job roles from job_roles joined with jobs via role_id where status='approved'
 * - tags: distinct tags from job_tags joined with job_tag_map and jobs where status='approved'
 */
async function getFilters(req, res) {
  try {
    // Fetch distinct cities from approved jobs
    const [cityRows] = await pool.query(`
      SELECT DISTINCT city 
      FROM jobs 
      WHERE status = 'approved' AND city IS NOT NULL AND city != ''
      ORDER BY city ASC
    `);

    // Fetch distinct job roles from approved jobs using job_roles table
    const [roleRows] = await pool.query(`
      SELECT DISTINCT jr.id, jr.name
      FROM job_roles jr
      INNER JOIN jobs j ON j.role_id = jr.id
      WHERE j.status = 'approved' AND jr.name IS NOT NULL AND jr.name != ''
      ORDER BY jr.name ASC
    `);

    // Fetch distinct tags from approved jobs via job_tag_map
    let tags = [];
    try {
      const [tagRows] = await pool.query(`
        SELECT DISTINCT jt.name as tag
        FROM job_tags jt
        INNER JOIN job_tag_map jtm ON jt.id = jtm.tag_id
        INNER JOIN jobs j ON jtm.job_id = j.id
        WHERE j.status = 'approved' AND jt.name IS NOT NULL AND jt.name != ''
        ORDER BY jt.name ASC
      `);
      tags = tagRows.map(row => row.tag);
    } catch (e) {
      // If tag tables don't exist or there's an error, return empty array
      console.error('Error fetching tags:', e.message);
    }

    const cities = cityRows.map(row => row.city);
    const roles = roleRows.map(row => ({ id: row.id, name: row.name }));

    res.json({
      ok: true,
      filters: {
        cities,
        roles,
        // keep legacy "titles" key for backward compatibility with any older clients
        titles: roles.map(r => r.name),
        tags
      }
    });
  } catch (err) {
    console.error('GET /api/jobs/filters error:', err);
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  }
}

module.exports = getFilters;
