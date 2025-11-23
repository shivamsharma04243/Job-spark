// api/jobs/list-jobs.js
const express = require('express');
const pool = require('../config/db'); // path relative to this file
const router = express.Router();

function parseSkills(skills) {
  if (!skills) return [];
  return skills.split(',').map(s => s.trim()).filter(Boolean);
}

async function getjobs (req, res) {
  try {
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || '10', 10)));
    const sql = `
      SELECT
        id,
        title,
        company,
        job_type,
        city,
        locality,
        min_experience,
        max_experience,
        salary,
        vacancies,
        description,
        logo_path,
        created_at
      FROM jobs
      ORDER BY created_at DESC
      LIMIT ?
    `;
    const [rows] = await pool.query(sql, [limit]);

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

    const jobs = rows.map(r => {
      let experiance = 'Not specified';
      if (r.min_experience == null && r.max_experience == null) experiance = 'Fresher';
      else if (r.min_experience != null && r.max_experience == null) experiance = `${r.min_experience}+ yrs`;
      else if (r.min_experience == null && r.max_experience != null) experiance = `Up to ${r.max_experience} yrs`;
      else experiance = `${r.min_experience}-${r.max_experience} yrs`;

      return {
        id: r.id,
        title: r.title,
        company: r.company,
        type: r.job_type || 'Full-time',
        location: r.city + (r.locality ? `, ${r.locality}` : ''),
        tags: tagMap[r.id] || parseSkills(r.skills || r.tags || r.skill || ''),
        salary: r.salary || null,
        vacancies: r.vacancies,
        description: r.description,
        logoPath: r.logo_path || null,
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
