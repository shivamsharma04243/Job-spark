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
        contact_email,
        contact_phone,
        interview_address,
        posted_at,
        created_at
      FROM jobs
      WHERE recruiter_id = ?
      ORDER BY created_at DESC
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

    const jobs = rows.map(r => {
      let experience = 'Not specified';
      if (r.min_experience == null && r.max_experience == null) experience = 'Fresher';
      else if (r.min_experience != null && r.max_experience == null) experience = `${r.min_experience}+ yrs`;
      else if (r.min_experience == null && r.max_experience != null) experience = `Up to ${r.max_experience} yrs`;
      else experience = `${r.min_experience}-${r.max_experience} yrs`;

      return {
        id: r.id,
        title: r.title,
        company: r.company,
        type: r.job_type || 'Full-time',
        location: r.city + (r.locality ? `, ${r.locality}` : ''),
        tags: tagMap[r.id] || [],
        salary: r.salary || 'Not specified',
        vacancies: r.vacancies,
        description: r.description,
        logoPath: r.logo_path || null,
        contactEmail: r.contact_email,
        contactPhone: r.contact_phone,
        interviewAddress: r.interview_address,
        postedAt: r.posted_at,
        createdAt: r.created_at,
        experience,
      };
    });

    res.json({ ok: true, jobs });
  } catch (err) {
    console.error('GET /api/recruiter/jobs error:', err);
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  }
}

module.exports = getRecruiterJobs;