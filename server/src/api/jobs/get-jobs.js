const pool = require('../config/db');
const jwt = require('jsonwebtoken');

function parseSkills(skills) {
  if (!skills) return [];
  return skills.split(',').map(s => s.trim()).filter(Boolean);
}

// Helper function to optionally get user ID from token
function getUserIdFromToken(req) {
  try {
    const token = req.cookies?.token;
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload.sub || null;
  } catch (err) {
    // Token invalid or expired - return null (user not authenticated)
    return null;
  }
}

async function getjobs(req, res) {
  try {
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '10', 10)));
    const userId = getUserIdFromToken(req);

    // Build SQL query - exclude jobs user has already applied for if authenticated
    let sql;
    let params;

    if (userId) {
      // User is authenticated - exclude applied jobs
      sql = `
        SELECT
          j.id,
          j.title,
          j.company,
          j.job_type,
          j.work_mode,
          j.city,
          j.locality,
          j.min_experience,
          j.max_experience,
          j.min_salary,
          j.max_salary,
          j.vacancies,
          j.description,
          j.logo_path,
          j.status,
          j.created_at
        FROM jobs j
        LEFT JOIN job_applications ja ON j.id = ja.job_id AND ja.user_id = ?
        WHERE j.status = 'approved' 
          AND ja.id IS NULL
        ORDER BY j.created_at DESC
        LIMIT ?
      `;
      params = [userId, limit];
    } else {
      // User not authenticated - show all approved jobs
      sql = `
        SELECT
          id,
          title,
          company,
          job_type,
          work_mode,
          city,
          locality,
          min_experience,
          max_experience,
          min_salary,
          max_salary,
          vacancies,
          description,
          logo_path,
          status,
          created_at
        FROM jobs
        WHERE status = 'approved'
        ORDER BY created_at DESC
        LIMIT ?
      `;
      params = [limit];
    }

    const [rows] = await pool.query(sql, params);

    // Fetch tags from normalized tables when available (silent fallback)
    let tagMap = {};
    if (Array.isArray(rows) && rows.length) {
      try {
        const ids = rows.map((r) => r.id);
        const placeholders = ids.map(() => '?').join(',');
        const tagSql = `SELECT jtm.job_id, jt.name as tag FROM job_tag_map jtm JOIN job_tags jt ON jt.id = jtm.tag_id WHERE jtm.job_id IN (${placeholders})`;
        const [tagRows] = await pool.query(tagSql, ids);
        tagRows.forEach((tr) => {
          tagMap[tr.job_id] = tagMap[tr.job_id] || [];
          tagMap[tr.job_id].push(tr.tag);
        });
      } catch (e) {
        // silently ignore missing tag tables or errors
      }
    }

    // Helper function to format salary range (monthly)
    const formatSalary = (minSalary, maxSalary) => {
      if (minSalary == null && maxSalary == null) return null;
      if (minSalary != null && maxSalary != null) {
        return `${minSalary}-${maxSalary} /Month`;
      }
      if (minSalary != null) return `${minSalary}+ /Month`;
      if (maxSalary != null) return `Up to ${maxSalary} /Month`;
      return null;
    };

    const jobs = rows.map(r => {
      let experiance = 'Not specified';
      if (r.min_experience == null && r.max_experience == null) experiance = 'Fresher';
      else if (r.min_experience != null && r.max_experience == null) experiance = `${r.min_experience}+ yrs`;
      else if (r.min_experience == null && r.max_experience != null) experiance = `Up to ${r.max_experience} yrs`;
      else experiance = `${r.min_experience}-${r.max_experience} yrs`;

      // Build location string safely handling null/undefined values
      let location = '';
      if (r.city) {
        location = r.city;
        if (r.locality) {
          location += `, ${r.locality}`;
        }
      } else if (r.locality) {
        location = r.locality;
      } else {
        location = 'Not specified';
      }

      return {
        id: r.id,
        title: r.title,
        company: r.company,
        type: r.job_type || 'Full-time',
        workMode: r.work_mode || 'Office',
        location,
        tags: tagMap[r.id] || parseSkills(r.skills || r.tags || r.skill || ''),
        salary: formatSalary(r.min_salary, r.max_salary),
        minSalary: r.min_salary,
        maxSalary: r.max_salary,
        vacancies: r.vacancies,
        description: r.description,
        logoPath: r.logo_path || null,
        status: r.status || 'approved', // Include status, default to approved for public listing
        createdAt: r.created_at,
        experiance,
      };
    });

    res.json({ ok: true, jobs });
  } catch (err) {
    console.error('GET /api/jobs error:', err);
    try {
      const fs = require('fs');
      const path = require('path');
      const dbgPath = path.join(__dirname, '../../../debug_jobs.log');
      const now = new Date().toISOString();
      fs.appendFileSync(dbgPath, `${now} - ERROR: ${err && err.stack ? err.stack : String(err)}\n`);
    } catch (e) {
      // ignore file logging errors
    }
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  }
};

module.exports = getjobs;