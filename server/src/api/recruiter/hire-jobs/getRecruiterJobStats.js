const pool = require("../../config/db");

async function getRecruiterJobStats(req, res) {
  try {
    const recruiterId = req.user?.id;
    
    if (!recruiterId) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    // Get jobs with application counts
    const sql = `
      SELECT 
        j.id,
        j.title,
        j.company,
        j.job_type,
        j.city,
        j.locality,
        j.vacancies,
        j.created_at,
        COUNT(ja.id) as application_count
      FROM jobs j
      LEFT JOIN job_applications ja ON j.id = ja.job_id
      WHERE j.recruiter_id = ?
      GROUP BY j.id
      ORDER BY j.created_at DESC
    `;
    
    const [rows] = await pool.query(sql, [recruiterId]);

    const jobs = rows.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      type: job.job_type,
      location: job.city + (job.locality ? `, ${job.locality}` : ''),
      vacancies: job.vacancies,
      applicationCount: job.application_count,
      createdAt: job.created_at
    }));

    res.json({ ok: true, jobs });
  } catch (err) {
    console.error('GET /api/recruiter/job-stats error:', err);
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  }
}

module.exports = getRecruiterJobStats;