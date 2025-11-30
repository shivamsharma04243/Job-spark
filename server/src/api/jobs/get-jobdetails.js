const express = require('express');
const pool = require('../config/db');
const router = express.Router();

async function getjobdetails(req, res)  {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ ok: false, message: 'Invalid job id' });

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
        created_at,
        contact_email,
        contact_phone,
        interview_address
      FROM jobs
      WHERE id = ?
      LIMIT 1
    `;
    const [rows] = await pool.query(sql, [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ ok: false, message: 'Job not found' });

    const r = rows[0];
    let experiance = 'Not specified';
    if (r.min_experience == null && r.max_experience == null) experiance = 'Fresher';
    else if (r.min_experience != null && r.max_experience == null) experiance = `${r.min_experience}+ yrs`;
    else if (r.min_experience == null && r.max_experience != null) experiance = `Up to ${r.max_experience} yrs`;
    else experiance = `${r.min_experience}-${r.max_experience} yrs`;

    // fetch tags from tag tables if available (silent fallback)
    let tags = [];
    try {
      const [tagRows] = await pool.query(
        `SELECT jtm.job_id, jt.name as tag FROM job_tag_map jtm JOIN job_tags jt ON jt.id = jtm.tag_id WHERE jtm.job_id = ?`,
        [id]
      );
      tags = tagRows.map(tr => tr.tag);
    } catch (e) {
      // ignore if tag tables aren't present
    }

    const job = {
      id: r.id,
      title: r.title,
      company: r.company,
      type: r.job_type || 'Full-time',
      location: r.city + (r.locality ? `, ${r.locality}` : ''),
      tags: tags.length ? tags : (r.skills || '').split(',').map(s => s.trim()).filter(Boolean),
      salary: r.salary || null,
      vacancies: r.vacancies,
      description: r.description,
      logoPath: r.logo_path || null,
      createdAt: r.created_at,
      experiance,
      min_experience: r.min_experience,
      max_experience: r.max_experience,
      contactEmail: r.contact_email || null,
      contactPhone: r.contact_phone || null,
      interviewAddress: r.interview_address || null,
    };

    res.json({ ok: true, job });
  } catch (err) {
    console.error('GET /api/jobs/:id error:', err);
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  }
};
module.exports = getjobdetails;
