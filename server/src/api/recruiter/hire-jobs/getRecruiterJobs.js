const pool = require("../../config/db");

function parseSkills(skills) {
  if (!skills) return [];
  return skills.split(',').map(s => s.trim()).filter(Boolean);
}

async function getRecruiterJobs(req, res) {
  try {
    const recruiterId = req.user?.id;

    if (!recruiterId) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    const sql = `
      SELECT
        j.id,
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
        j.contact_email,
        j.contact_phone,
        j.interview_address,
        j.show_interview_address,
        j.show_contact_phone,
        j.status,
        j.rejection_reason,
        j.posted_at,
        j.created_at,
        (SELECT COUNT(*) FROM job_applications WHERE job_id = j.id) as application_count
      FROM jobs j
      LEFT JOIN job_roles jr ON j.role_id = jr.id
      WHERE j.recruiter_id = ?
      ORDER BY j.created_at DESC
    `;

    const [rows] = await pool.query(sql, [recruiterId]);

    // Fetch tags from normalized tables
    let tagMap = {};
    if (Array.isArray(rows) && rows.length) {
      try {
        const ids = rows.map((r) => r.id);
        if (ids.length > 0) {
          const placeholders = ids.map(() => '?').join(',');
          const tagSql = `SELECT jtm.job_id, jt.name as tag FROM job_tag_map jtm JOIN job_tags jt ON jt.id = jtm.tag_id WHERE jtm.job_id IN (${placeholders})`;
          const [tagRows] = await pool.query(tagSql, ids);
          tagRows.forEach((tr) => {
            tagMap[tr.job_id] = tagMap[tr.job_id] || [];
            tagMap[tr.job_id].push(tr.tag);
          });
        }
      } catch (e) {
        console.error('Error fetching tags:', e.message);
      }
    }

    // Helper function to format salary range (monthly)
    const formatSalary = (minSalary, maxSalary) => {
      if (minSalary == null && maxSalary == null) return 'Not specified';
      if (minSalary != null && maxSalary != null) {
        return `${minSalary}-${maxSalary} /Month`;
      }
      if (minSalary != null) return `${minSalary}+ /Month`;
      if (maxSalary != null) return `Up to ${maxSalary} /Month`;
      return 'Not specified';
    };

    const jobs = rows.map(r => {
      let experience = 'Not specified';
      if (r.min_experience == null && r.max_experience == null) experience = 'Fresher';
      else if (r.min_experience != null && r.max_experience == null) experience = `${r.min_experience}+ yrs`;
      else if (r.min_experience == null && r.max_experience != null) experience = `Up to ${r.max_experience} yrs`;
      else experience = `${r.min_experience}-${r.max_experience} yrs`;

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
        city: r.city || null,
        location,
        tags: tagMap[r.id] || [],
        salary: formatSalary(r.min_salary, r.max_salary),
        minSalary: r.min_salary,
        maxSalary: r.max_salary,
        vacancies: r.vacancies,
        description: r.description,
        logoPath: r.logo_path || null,
        contactEmail: r.contact_email,
        contactPhone: r.contact_phone,
        interviewAddress: r.interview_address,
        showInterviewAddress: r.show_interview_address !== undefined ? Boolean(r.show_interview_address) : true,
        showContactPhone: r.show_contact_phone !== undefined ? Boolean(r.show_contact_phone) : true,
        status: r.status || 'pending',
        rejectionReason: r.rejection_reason || null,
        postedAt: r.posted_at,
        createdAt: r.created_at,
        experience,
        applicationCount: parseInt(r.application_count) || 0,
      };
    });

    res.json({ ok: true, jobs });
  } catch (err) {
    console.error('GET /api/recruiter/jobs error:', err);
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  }
}

module.exports = getRecruiterJobs;