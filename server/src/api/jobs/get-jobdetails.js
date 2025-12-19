const express = require('express');
const pool = require('../config/db');
const router = express.Router();

async function getjobdetails(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ ok: false, message: 'Invalid job id' });

    const sql = `
      SELECT
        j.id,
        j.role_id,
        jr.name AS role_name,
        jr.name AS title,
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
        j.created_at,
        j.contact_email,
        j.contact_phone,
        j.interview_address,
        j.recruiter_id
      FROM jobs j
      LEFT JOIN job_roles jr ON j.role_id = jr.id
      WHERE j.id = ?
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

    // Format salary range (monthly)
    const formatSalary = (minSalary, maxSalary) => {
      if (minSalary == null && maxSalary == null) return null;
      if (minSalary != null && maxSalary != null) {
        return `${minSalary}-${maxSalary} /Month`;
      }
      if (minSalary != null) return `${minSalary}+ /Month`;
      if (maxSalary != null) return `Up to ${maxSalary} /Month`;
      return null;
    };

    const job = {
      id: r.id,
      roleId: r.role_id || null,
      roleName: r.role_name || null,
      title: r.title,
      company: r.company,
      type: r.job_type || 'Full-time',
      workMode: r.work_mode || 'Office',
      city: r.city || null,
      locality: r.locality || null,
      location,
      tags: tags.length ? tags : (r.skills || '').split(',').map(s => s.trim()).filter(Boolean),
      salary: formatSalary(r.min_salary, r.max_salary),
      minSalary: r.min_salary,
      maxSalary: r.max_salary,
      vacancies: r.vacancies,
      description: r.description,
      logoPath: r.logo_path || null,
      status: r.status || 'pending',
      createdAt: r.created_at,
      experiance,
      min_experience: r.min_experience,
      max_experience: r.max_experience,
      contactEmail: r.contact_email || null,
      contactPhone: r.contact_phone || null,
      interviewAddress: r.interview_address || null,
      recruiterId: r.recruiter_id || null,
    };

    res.json({ ok: true, job });
  } catch (err) {
    console.error('GET /api/jobs/:id error:', err);
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  }
};
module.exports = getjobdetails;
