const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Helper function to generate JobPosting schema
function generateJobPostingSchema(job, baseUrl) {
  // Data validation - don't output incomplete jobs
  if (!job.title || !job.description || (job.workMode !== 'Remote' && (!job.city || !job.state))) {
    return null;
  }

  const postedAt = new Date(job.posted_at);
  const validThrough = new Date(postedAt);
  validThrough.setDate(validThrough.getDate() + 30); // 30 days from posted_at

  const schema = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "identifier": {
      "@type": "PropertyValue",
      "name": job.company,
      "value": job.id.toString()
    },
    "datePosted": postedAt.toISOString(),
    "validThrough": validThrough.toISOString(),
    "employmentType": job.type,
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company,
      "logo": job.logoPath ? `${baseUrl}/${job.logoPath}` : undefined
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.workMode === 'Remote' ? undefined : job.city,
        "addressRegion": job.workMode === 'Remote' ? undefined : job.state,
        "addressCountry": "IN"
      }
    },
    "applicantLocationRequirements": {
      "@type": "Country",
      "name": "India"
    },
    "jobLocationType": job.workMode === 'Remote' ? "TELECOMMUTE" : undefined,
    "directApply": true,
    "applyAction": {
      "@type": "ApplyAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/jobs/${job.id}`,
        "inLanguage": "en-US",
        "description": "Apply for this job on Jobion"
      }
    }
  };

  // Remove undefined values
  Object.keys(schema).forEach(key => {
    if (schema[key] === undefined) {
      delete schema[key];
    }
  });

  // Clean up nested objects
  if (schema.hiringOrganization.logo === undefined) {
    delete schema.hiringOrganization.logo;
  }

  if (schema.jobLocation.address.addressLocality === undefined &&
    schema.jobLocation.address.addressRegion === undefined) {
    delete schema.jobLocation.address.addressLocality;
    delete schema.jobLocation.address.addressRegion;
  }

  return schema;
}

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
        j.state,
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
        j.posted_at,
        j.contact_email,
        j.contact_phone,
        j.interview_address,
        j.show_interview_address,
        j.show_contact_phone,
        j.recruiter_id
      FROM jobs j
      LEFT JOIN job_roles jr ON j.role_id = jr.id
      WHERE j.id = ? AND j.status = 'approved'
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
      state: r.state || null,
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
      posted_at: r.posted_at,
      experiance,
      min_experience: r.min_experience,
      max_experience: r.max_experience,
      contactEmail: r.contact_email || null,
      contactPhone: r.contact_phone || null,
      interviewAddress: r.interview_address || null,
      showInterviewAddress: r.show_interview_address !== undefined ? Boolean(r.show_interview_address) : true,
      showContactPhone: r.show_contact_phone !== undefined ? Boolean(r.show_contact_phone) : true,
      recruiterId: r.recruiter_id || null,
    };

    // Generate JobPosting schema for Google Jobs
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const jobPostingSchema = generateJobPostingSchema(job, baseUrl);

    res.json({
      ok: true,
      job,
      jobPostingSchema // Include schema in response for frontend
    });
  } catch (err) {
    console.error('GET /api/jobs/:id error:', err);
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  }
};
module.exports = getjobdetails;
