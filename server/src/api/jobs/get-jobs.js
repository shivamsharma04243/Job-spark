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
        skills,
        min_experience,
        max_experience,
        salary,
        vacancies,
        description,
        logo_path,
        created_at
      FROM recruiter_jobs
      ORDER BY created_at DESC
      LIMIT ?
    `;
    const [rows] = await pool.query(sql, [limit]);

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
        tags: parseSkills(r.skills),
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
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  }
};

module.exports = getjobs;
